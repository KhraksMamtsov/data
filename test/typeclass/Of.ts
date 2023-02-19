import * as O from "@effect/data/Option"
import * as RA from "@effect/data/ReadonlyArray"
import * as _ from "@effect/data/typeclass/Of"
import * as U from "../util"

describe("Of", () => {
  it("ofComposition", () => {
    const of = _.ofComposition(RA.Of, O.Of)
    U.deepStrictEqual(of(1), [O.some(1)])
  })

  it("unit", () => {
    U.deepStrictEqual(_.unit(O.Pointed), O.some(undefined))
  })
})