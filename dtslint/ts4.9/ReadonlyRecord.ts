import { pipe } from '@effect/data/Function'
import * as RR from '@effect/data/ReadonlyRecord'
import * as Brand from '@effect/data/Brand'

declare const r: Record<string, number>
declare const struct: Record<'a' | 'b', number>

//
// map
//

// $ExpectType Record<string, boolean>
RR.map(r, (
  value, // $ExpectType number
  _key, // $ExpectType string
) => value > 0)

// $ExpectType Record<string, boolean>
pipe(r, RR.map((
  value, // $ExpectType number
  _key, // $ExpectType string
) => value > 0))

// $ExpectType Record<"a" | "b", boolean>
RR.map(struct, (
  value, // $ExpectType number
  _key, // $ExpectType "a" | "b"
) => value > 0)

// $ExpectType Record<"a" | "b", boolean>
pipe(struct, RR.map((
  value, // $ExpectType number
  _key, // $ExpectType "a" | "b"
) => value > 0))

const constStruct = { a: 1, b: 2 } as const;

function mapToBoolean(): { [K in keyof typeof constStruct]: boolean } {
  return RR.map(constStruct, () => true);
}

// $ExpectType { readonly a: boolean; readonly b: boolean; }
mapToBoolean()

//
// get
//

// $ExpectType Option<number>
pipe(r, RR.get('a'))

//
// replaceOption
//

// $ExpectType Option<Record<string, number>>
pipe(r, RR.replaceOption('a', 2))

// $ExpectType Option<Record<string, number | boolean>>
pipe(r, RR.replaceOption('a', true))

//
// modifyOption
//

// $ExpectType Option<Record<string, number>>
pipe(r, RR.modifyOption('a', () => 2))

// $ExpectType Option<Record<string, number | boolean>>
pipe(r, RR.modifyOption('a', () => true))

// -------------------------------------------------------------------------------------
// toEntries
// -------------------------------------------------------------------------------------

// baseline
// $ExpectType [string, number][]
RR.toEntries(r)
// $ExpectType ["a" | "b", number][]
RR.toEntries(struct)
// $ExpectType ["a" | "b" | "c", string | number | boolean][]
RR.toEntries({ a: 'a', b: 2, c: true })

declare const brandedRecord: Record<string & Brand.Brand<"brandedString">, number>

// should support brands
// $ExpectType [string & Brand<"brandedString">, number][]
RR.toEntries(brandedRecord)
