import type { Kind, TypeClass, TypeLambda } from "@fp-ts/core/HKT"
import * as C from "@fp-ts/data/Chunk"
import { hole, identity, pipe } from "@fp-ts/data/Function"
import * as L from "@fp-ts/data/List"
import * as RA from "@fp-ts/data/ReadonlyArray"

export interface ReadonlyArrayLike<F extends TypeLambda> extends TypeClass<F> {
  readonly fromIterable: <A>(self: Iterable<A>) => Kind<F, unknown, never, never, A>
  readonly toIterable: <R, O, E, A>(self: Kind<F, R, O, E, A>) => Iterable<A>
  readonly take: (n: number) => <R, O, E, A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
  readonly reverse: <R, O, E, A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
  readonly drop: (n: number) => <R, O, E, A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
  readonly prepend: <B>(
    b: B
  ) => <R, O, E, A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A | B>
  readonly prependAll: <R, O, E, B>(
    prefix: Kind<F, R, O, E, B>
  ) => <A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A | B>
  readonly concat: <R, O, E, B>(
    prefix: Kind<F, R, O, E, B>
  ) => <A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A | B>
}

export const ReadonlyArray: ReadonlyArrayLike<RA.ReadonlyArrayTypeLambda> = {
  fromIterable: RA.fromIterable,
  toIterable: identity,
  take: RA.take,
  reverse: RA.reverse,
  drop: RA.drop,
  prepend: RA.prepend,
  prependAll: RA.prependAll,
  concat: RA.concat
}

export const List: ReadonlyArrayLike<L.ListTypeLambda> = {
  fromIterable: L.fromIterable,
  toIterable: L.toReadonlyArray,
  take: L.take,
  reverse: L.reverse,
  drop: L.drop,
  prepend: L.prepend,
  prependAll: L.prependAll,
  concat: L.concat
}

export const Chunk: ReadonlyArrayLike<C.ChunkTypeLambda> = {
  fromIterable: C.fromIterable,
  toIterable: C.toReadonlyArray,
  take: C.take,
  reverse: C.reverse,
  drop: C.drop,
  prepend: C.prepend,
  prependAll: hole, // TODO
  concat: C.concat
}

describe.concurrent("ReadonlyArrayLike", () => {
  it("fromIterable / toIterable", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      const as = [1, 2, 3, 4]
      // roundtrip
      expect(F.toIterable(F.fromIterable(as)), message).toEqual(as)
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("take", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      const as = [1, 2, 3, 4]
      expect(pipe(F.fromIterable(as), F.take(2), F.toIterable), message).toEqual([1, 2])
      // take(0)
      expect(pipe(F.fromIterable(as), F.take(0), F.toIterable), message).toEqual([])
      // out of bounds
      expect(pipe(F.fromIterable(as), F.take(-10), F.toIterable), message).toEqual([])
      expect(pipe(F.fromIterable(as), F.take(10), F.toIterable), message).toEqual(as)
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("reverse", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      const as = [1, 2, 3, 4]
      expect(pipe(F.fromIterable(as), F.reverse, F.toIterable), message).toEqual([4, 3, 2, 1])
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("drop", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      const as = [1, 2, 3, 4]
      expect(pipe(F.fromIterable(as), F.drop(2), F.toIterable), message).toEqual([3, 4])
      // drop(0)
      expect(pipe(F.fromIterable(as), F.drop(0), F.toIterable), message).toEqual(as)
      // out of bounds
      expect(pipe(F.fromIterable(as), F.drop(-10), F.toIterable), message).toEqual(as)
      expect(pipe(F.fromIterable(as), F.drop(10), F.toIterable), message).toEqual([])
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("prepend", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      expect(pipe(F.fromIterable([1, 2, 3, 4]), F.prepend("a"), F.toIterable), message)
        .toEqual(["a", 1, 2, 3, 4])
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("prependAll", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      expect(
        pipe(F.fromIterable([1, 2]), F.prependAll(F.fromIterable(["a", "b"])), F.toIterable),
        message
      ).toEqual(["a", "b", 1, 2])
      expect(
        pipe(F.fromIterable([1, 2]), F.prependAll(F.fromIterable([])), F.toIterable),
        message
      ).toEqual([1, 2])
      expect(
        pipe(F.fromIterable([]), F.prependAll(F.fromIterable(["a", "b"])), F.toIterable),
        message
      ).toEqual(["a", "b"])
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    // TODO
    // assert(Chunk, "Chunk")
  })

  it("concat", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      expect(
        pipe(F.fromIterable([1, 2]), F.concat(F.fromIterable(["a", "b"])), F.toIterable),
        message
      ).toEqual([1, 2, "a", "b"])
      expect(
        pipe(F.fromIterable([1, 2]), F.concat(F.fromIterable([])), F.toIterable),
        message
      ).toEqual([1, 2])
      expect(
        pipe(F.fromIterable([]), F.concat(F.fromIterable(["a", "b"])), F.toIterable),
        message
      ).toEqual(["a", "b"])
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })
})