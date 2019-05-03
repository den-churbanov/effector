//@flow

import {is} from 'effector/validate'
import {eventFabric, forward} from 'effector/event'
import {storeFabric} from 'effector/store'
import {
  createGraph,
  step,
  type Graphite,
  createStateRef,
  readRef,
  writeRef,
  nextBarrierID,
} from 'effector/stdlib'
import {noop} from './blocks'

import invariant from 'invariant'

const sampleStore = (source, sampler) => {
  const state = createStateRef()
  const target = storeFabric({
    currentState: writeRef(state, source.getState()),
    config: {name: source.shortName},
    parent: source.domainName,
  })

  createLink(source, {
    node: [step.update({store: state})],
  })
  createLink(sampler, {
    scope: {state},
    child: [target],
    node: [
      noop,
      step.barrier({
        barrierID: nextBarrierID(),
        priority: 'sampler',
      }),
      step.compute({
        fn: (upd, {state}) => readRef(state),
      }),
    ],
  })
  return target
}

const sampleEvent = (source, sampler) => {
  const state = createStateRef()
  const target = eventFabric({
    name: source.shortName,
    parent: source.domainName,
  })
  const hasValue = createStateRef(false)

  createLink(source, {
    scope: {
      hasValue,
    },
    node: [
      step.update({store: state}),
      step.tap({
        fn(upd, {hasValue}) {
          writeRef(hasValue, true)
        },
      }),
    ],
  })
  createLink(sampler, {
    scope: {
      state,
      hasValue,
    },
    child: [target],
    node: [
      step.filter({
        fn: (upd, {hasValue}) => readRef(hasValue),
      }),
      step.barrier({
        barrierID: nextBarrierID(),
        priority: 'sampler',
      }),
      step.compute({
        fn: (upd, {state}) => readRef(state),
      }),
    ],
  })
  return target
}

export function sample(source: any, sampler: Graphite): any {
  invariant(
    is.unit(source),
    'sample: First argument should be Event, ' +
      'Store or Effect, but you passed %s',
    source,
  )
  return is.store(source)
    ? sampleStore(source, sampler)
    : sampleEvent(source, sampler)
}

const createLink = (from, config) => {
  const to = createGraph(config)
  return forward({from, to})
}
