---
layout: default
permalink: /typescript
---

# TypeScript Cheatsheet

Useful links :
- [Official documentation](https://www.typescriptlang.org/docs/)
- [Official Cheatsheets](https://www.typescriptlang.org/cheatsheets/)

<br><br>




## tsconfig.json

```ts
noImplicitAny
strictNullChecks
```

<br>





## General Knowledge


Check truthiness via double-Boolean negation :
```ts
Boolean("hello"); // type: boolean, value: true
!!"world";        // type: true,    value: true
```


Assert that a value is for sure not null or undefined :
```ts
function liveDangerously(x?: number | null) {
  console.log(x!.toFixed());
}
```


`unknown` is similar to `any` but cannot be used :
```ts
function f1(a: any) {
  a.b(); // OK
}
function f2(a: unknown) {
  a.b(); // Error: 'a' cannot be used
}

function safeParse(s: string): unknown {
  return JSON.parse(s);
}
const obj = safeParse(someRandomString); // Need to be careful with 'obj'!
```


`never`, for future-proofing :
```ts
type Shape = Circle | Square;
 
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
	  // 'never' ensure that expanding the Shape type will generate an error if
	  // we later add another Shape in the union (ex: type Shape = Circle | Square | Triangle)
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```


`keyof` builds a union type of all keys from an existing type :
```ts
type User = {
  id: number;
  name: string;
  isAdmin: boolean;
};

type UserKeys = keyof User; // UserKeys: "id" | "name" | "isAdmin";
```


Read-only arrays :
```ts
const readonlyArray: ReadonlyArray<string> = ["red", "green", "blue"];

function doStuff(values: readonly string[]) {
  console.log(`The first value is ${values[0]}`); // read
  values.push("hello!"); // error: Property 'push' does not exist on type 'readonly string[]'.
}
```

<br>





## Function parameters


Optional parameters :
```typescript
function printName(obj: { first: string; last?: string }) {}

function f(x?: number) {}
function f(x: number = 10) {}
```


Parameter destructuring :
```ts
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}
// or 
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```


"Options" parameter :
```ts
// Only 'last' is optional
function sayName({ first, last = 'Smith' }: { first: string; last?: string }) {}
// Everything is optional
function sayName({ first='Bob', last='Smith'}: { first?: string; last?: string} = {}) {}
```


"Options" parameter with default values :
```ts
function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {}
```


Variable amount of parameters :
```ts
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
const a = multiply(5, 10, 20, 30); // a = [50,100,150]
```


Function overloads :
```ts
function makeDate(timestamp: number): Date; // Overload signature 1 (can be called)
function makeDate(m: number, d: number, y: number): Date; // Overload signature 2 (can be called)
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date { // Implementation signature (cannot be called)
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678); // Calls signature 1
const d2 = makeDate(5, 5, 5); // Calls signature 2
const d3 = makeDate(1, 3); // Error
```

<br>





## Type / Interface / Tuple

Type :
```ts
type Point = {
	x: number;
	y: number;
};

type Point3D = Point & {
	z: number;
}
```

Interface :
```ts
interface Point {
	x: number;
	y: number;
}

interface Point3D extends Point {
	z: number;
}

interface Point { // Modifies the existing interface
	name: string
}
```

Optional property :
```ts
interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}
```


Union types :
```ts
type ColorfulCircle = Colorful | Circle;
```


Intersection types :
```ts
type ColorfulCircle = Colorful & Circle;
```


Using types to define functions through `fn` :
```ts
type GreetFunction = (a: string) => void;
function greeter(fn: GreetFunction) {}
```


Tuple :
```ts
type StringNumberPair = [string, number];

function doSomething(stringHash: StringNumberPair) {
  const [inputString, hash] = stringHash; // Destructuring
}

// Tuples can have a variable amount of elements
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];

// Read-only variant
function doSomething(pair: readonly [string, number]) {}
```

<br>





## Type Narrowing


`in` narrowing :
```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };
 
function move(animal: Fish | Bird) {
  if ("swim" in animal) { // animal is narrowed to Fish
    return animal.swim();
  }
  return animal.fly();
}
```

`instanceof` narrowing :
```ts
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString()); // x: Date
  } else {
    console.log(x.toUpperCase()); // x: string
  }
}
```


Declared Type vs Observed Type :
```ts
let x = Math.random() < 0.5 ? 10 : "hello world!"; // x: string | number
x = 1; // x: number
x = "goodbye!"; // x: string
```

`is` type predicate :
```ts
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

let pet = getSmallPet();
if (isFish(pet)) { // Type is automatically narrowed to Fish
  pet.swim();
} else {
  pet.fly();
}

// We can use the type predicate for filtering
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
```


Enforce type narrowing :
```typescript
declare function handleRequest(url: string, method: "GET" | "POST"): void;
 
const req = { url: "https://example.com", method: "GET" };
// No guarantee that the value of `method` has not changed between its declaration and the call to `handleRequest`
handleRequest(req.url, req.method);
```
> `Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.`

3 solutions :
```ts
// Assert the type in the declaration
const req = { url: "https://example.com", method: "GET" as "GET" };

// Assert the type in the call
handleRequest(req.url, req.method as "GET");

// Convert the entire object into type literals :
const req = { url: "https://example.com", method: "GET" } as const;
```

Narrowing through common properties :
```ts
interface Circle {
  kind: "circle";
  radius: number;
}
interface Square {
  kind: "square";
  sideLength: number;
}
 
type Shape = Circle | Square;

function getArea(shape: Shape) {
  if (shape.kind === "circle") { // Type narrowed to Circle
    return Math.PI * shape.radius ** 2;
  }
}
```

<br>





## Generic types

Generic function type :
```ts
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}

const s = firstElement(["a", "b", "c"]); // s: string
const n = firstElement([1, 2, 3]);       // n: number
const u = firstElement([]);              // u: undefined
```

Generic type definition :
```ts
interface Box<Type> {
  contents: Type;
}
// Or
type Box<Type> = {
  contents: Type;
};

let box: Box<string>;
```

Constrain a generic function :
```ts
// "Type" includes the 'length' property. No length => invalid type
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

const longerArray = longest([1, 2], [1, 2, 3]); // longerArray: number[]
const longerString = longest("alice", "bob"); // longerString: "alice" | "bob"
const notOK = longest(10, 100); // Error! Numbers don't have a 'length' property
```

Enforce the generic type, but from the caller :
```ts
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}

// Error, the generic function can only return one type, and it picks the first one it found (number[])
const arr = combine([1, 2, 3], ["hello"]);

// Will work, we explicitely tell TS what type the generic function will return
const arr = combine<string | number>([1, 2, 3], ["hello"]);
```

<br>





## Utility Types

`Awaited<Type>` : returned by a Promise chain
```ts
type A = Awaited<Promise<string>>;           // A: string
type B = Awaited<Promise<Promise<number>>>;  // B: number
type C = Awaited<boolean | Promise<number>>; // C: number | boolean
```


`Partial<Type>` : "copy" of a Type where everything is optional
```ts
interface Todo {
  title: string;
  description: string;
}
 
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}
```


`Required<Type>` : "copy" of a Type where everything is required (= opposite of Partial)
```ts
interface Props {
  a?: number;
  b?: string;
}

const obj: Props = { a: 5 };
const obj2: Required<Props> = { a: 5 }; // Error: Property 'b' is missing
```


`Readonly<Type>` : "copy" of a Type where everything is read-only
```ts
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
};
 
todo.title = "Hello"; // Error: Cannot assign to 'title' because it is a read-only property.
```


`Record<Keys, Type>` : Used to map a list of keys onto another Type
```ts
type CatName = "miffy" | "boris" | "mordred";
 
interface CatInfo {
  age: number;
}
 
const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10 },
  boris: { age: 5 },
  mordred: { age: 16 },
};
```

`Pick<Type, Keys>` : Whitelist some keys from an existing Type
```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}
 
type TodoPreview = Pick<Todo, "title" | "completed">;
 
const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```


`Omit<Type, Keys>` : Blacklist some keys from an existing Type. Opposite of `Pick`
```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}
 
type TodoPreview = Omit<Todo, "description" | "completed">;
 
const todo: TodoPreview = {
  title: "Clean room",
};
```


`Exclude<UnionType, ExcludedMembers>` : Blacklist some members of a type union
```ts
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };
type T3 = Exclude<Shape, { kind: "circle" }>;
```


`Extract<Type, Union>` : Get all members in common from 2 unions
```ts
type T0 = Extract<"a" | "b" | "c", "a" | "b", "f">; // "a" | "b"
```


`NonNullable<Type>` : Get a type without `null` and `undefined` values
```ts
type T0 = NonNullable<string | number | undefined>; // string | number
```


`Parameters<Type>` : contains all parameters of a function
```ts
type T0 = Parameters<() => string>; // []
type T1 = Parameters<(s: string) => void>; // [s: string]
```


`ConstructorParameters<Type>` : contains all parameters of a constructor
class C {
  constructor(a: number, b: string) {}
}
type T3 = ConstructorParameters<typeof C>; // [a: number, b: string]


`ReturnType<Type>` : contains 
```ts
declare function f1(): { a: number; b: string };
type T4 = ReturnType<typeof f1>; // type T4 = { a: number; b: string; }
```


<br>





# More on Types


Define an indexable type :
```ts
interface StringArray {
  [index: number]: string;
}
 
const myArray: StringArray = ["abc", "def"];
const secondItem = myArray[1]; // secondItem: string
```


Define an indexable & read-only type :
```ts
interface ReadonlyStringArray {
  readonly [index: number]: string;
}
 
let myArray: ReadonlyStringArray = getReadOnlyStringArray();
myArray[2] = "Mallory"; // Error, can only be read
```


Error when passing an object with too many properties :
```ts
interface SquareConfig {
  color?: string;
  width?: number;
}
 
function createSquare(config: SquareConfig) {}
 
let mySquare = createSquare({ other: "red", width: 100 }); // Error, 'other' is not needed
```
```ts
// Solution 1 :
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);

// Solution 2
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: unknown;
}
```

<br>





## Enums

> Enums ([Documentation](https://www.typescriptlang.org/docs/handbook/enums.html)) :

Examples
```typescript
// Base case
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// With a value
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

// Auto-incremented
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
```

<br>