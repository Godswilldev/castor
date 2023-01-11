/** CHALLENGE 1
 * ## `getUrlParams`

**Usage**: parse routes dynamically and extract path params into a key/value mapping

**Context**: This function is used on our frontend to extract id, tab name etc, from the url path 

**Goal**

Design a **Typescript** function taking 2 arguments:

- `path` (string) extracted from a URL in the form `staticOne/one/staticTwo/staticThree/two`
- `pattern` (string) with **static portions** and **params** (starting with `:`) in the form `staticOne/:paramOne/staticTwo/staticThree/:paramTwo`

The function should return:

- A object with the param name as key (ex `paramTwo`) and its corresponding value (ex `two`)
- empty record `{}` if no parameters are found

The parameters are extracted from left to right and the function stops if 

- A static parts between `path` and `pattern` differ
- The `path` shape is shorter than the `pattern`'s */

/**
 * CHALLENGE 1 - GET URL PARAMS
 * @param path string
 * @param pattern string
 * @returns  Record<string, string>
 */

const getUrlParams = (
  path: string,
  pattern: string
): Record<string, string> => {
  // split the pattern by "/"
  const arrayOfSplittedPattern = pattern.split("/");

  // split the path by "/"
  const arrayOfSplittedPath = path.split("/");

  // Object to be returned
  const objectToReturn: Record<string, string> = {};

  //   check for mutual exclusivity between the two arrays
  const notIncluded = arrayOfSplittedPattern.filter(
    (p) => arrayOfSplittedPath.indexOf(p) !== -1
  );

  //   if they are mutually exclusive return an empty object {}
  if (notIncluded.length === 0) {
    return objectToReturn;
  }

  //   else loop over the splitted path
  for (let i = 0; i < arrayOfSplittedPath.length; i++) {
    if (arrayOfSplittedPattern[i].startsWith(":")) {
      // get the word without the first character (":")
      objectToReturn[arrayOfSplittedPattern[i].substring(1)] =
        arrayOfSplittedPath[i];
    }
  }

  return objectToReturn;
};

const pattern = "staticOne/:paramOne/staticTwo/staticThree/:paramTwo";

// does not match the first static part: staticOne <> staticZero, returns {}
console.log(getUrlParams("staticZero/one", pattern));

// matched the first static and param part, returns {paramOne: 'one'}
console.log(getUrlParams("staticOne/one", pattern));

// matched the first static and param part with extra, returns {paramOne: 'one'}
console.log(getUrlParams("staticOne/one/staticThree/three", pattern));

// matched the first, second and third static + param parts
// returns {paramOne: 'one', paramTwo: 'two'}
console.log(getUrlParams("staticOne/one/staticTwo/staticThree/two", pattern));

/** CHALLENGE 2
 * ## `objectDiff`

**Usage: D**etect changes between two objects

**Context:** This function is used on our backend to detect and track changes upon database update of a resource

**Goal**

Design a **generic** function taking: 

- `source` an object of type `T` as source
- `target` an object of type `T` as target

The function should return an object where

- the keys are within `T`'s keys
- the values as objects of the shape `{old: oldValue, new: newValue}` 
corresponding to the `source[key]` for `oldValue` and `target[key]` for the `newValue` only if the value **differs** between the source and target

**Remark**

Keys should only be present in the returned record if changes occurred for that key between the source and target
 */

/**
 * @param source
 * @param target
 * @returns OBJECT in the shape of [Differences]
 */

interface Data {
  id: string;
  name?: string;
  count: number;
}

interface Differences {
  [key: string]: { old: any; new: any };
}

const objectDiff = <T>(
  source: T extends object ? any : any,
  target: T extends object ? any : any
): Differences => {
  // Object to be returned
  const finalObject: Differences = {};

  //  Loop over the target object
  for (let key in target) {
    // check if both the source and target have a different current (key) property
    if (!(source.hasOwnProperty(key) && target.hasOwnProperty(key))) {
      finalObject[key] = { old: source[key], new: target[key] };
    }
  }

  //   Loop over the source object
  for (let key in source) {
    // check if both the source and target has the current (key) property
    if (source.hasOwnProperty(key) && target.hasOwnProperty(key)) {
      // check if the source key is different from the target key
      if (source[key] !== target[key]) {
        finalObject[key] = { old: source[key], new: target[key] };
      }
    }
  }

  return finalObject;
};

const before: Data = { id: "1", count: 0 };

const after: Data = { id: "1", name: "khan", count: 1 };

// should read {name: {old: undefined, new: 'khan'}, count: {old: 0, new: 1}}
console.log(objectDiff(before, after));
