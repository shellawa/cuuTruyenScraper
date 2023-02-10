/* eslint-disable */

import * as wasm from "./cuudrm_bg.wasm.js"

const heap = new Array(32).fill(undefined)
let ret = []

heap.push(undefined, null, true, false)

function getObject(idx) {
  return heap[idx]
}

let heap_next = heap.length

function dropObject(idx) {
  if (idx < 36) return
  heap[idx] = heap_next
  heap_next = idx
}

function takeObject(idx) {
  const ret = getObject(idx)
  dropObject(idx)
  return ret
}

function debugString(val) {
  // primitive types
  const type = typeof val
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`
  }
  if (type == "string") {
    return `"${val}"`
  }
  if (type == "symbol") {
    const description = val.description
    if (description == null) {
      return "Symbol"
    } else {
      return `Symbol(${description})`
    }
  }
  if (type == "function") {
    const name = val.name
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`
    } else {
      return "Function"
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length
    let debug = "["
    if (length > 0) {
      debug += debugString(val[0])
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i])
    }
    debug += "]"
    return debug
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val))
  let className
  if (builtInMatches.length > 1) {
    className = builtInMatches[1]
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val)
  }
  if (className == "Object") {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return "Object(" + JSON.stringify(val) + ")"
    } catch (_) {
      return "Object"
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className
}

let WASM_VECTOR_LEN = 0

let cachegetUint8Memory0 = null
function getUint8Memory0() {
  if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer)
  }
  return cachegetUint8Memory0
}

const lTextEncoder = typeof TextEncoder === "undefined" ? (0, module.require)("util").TextEncoder : TextEncoder

let cachedTextEncoder = new lTextEncoder("utf-8")

const encodeString =
  typeof cachedTextEncoder.encodeInto === "function"
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view)
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg)
        view.set(buf)
        return {
          read: arg.length,
          written: buf.length
        }
      }

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg)
    const ptr = malloc(buf.length)
    getUint8Memory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf)
    WASM_VECTOR_LEN = buf.length
    return ptr
  }

  let len = arg.length
  let ptr = malloc(len)

  const mem = getUint8Memory0()

  let offset = 0

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset)
    if (code > 0x7f) break
    mem[ptr + offset] = code
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset)
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3))
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len)
    const ret = encodeString(arg, view)

    offset += ret.written
  }

  WASM_VECTOR_LEN = offset
  return ptr
}

let cachegetInt32Memory0 = null
function getInt32Memory0() {
  if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer)
  }
  return cachegetInt32Memory0
}

const lTextDecoder = typeof TextDecoder === "undefined" ? (0, module.require)("util").TextDecoder : TextDecoder

let cachedTextDecoder = new lTextDecoder("utf-8", { ignoreBOM: true, fatal: true })

cachedTextDecoder.decode()

function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len))
}

let stack_pointer = 32

function addBorrowedObject(obj) {
  if (stack_pointer == 1) throw new Error("out of js stack")
  heap[--stack_pointer] = obj
  return stack_pointer
}
/**
 * @param {HTMLImageElement} obfuscated_image
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} drm_data
 */
export function render_image(obfuscated_image, ctx, drm_data) {
  try {
    ret = []
    var ptr0 = passStringToWasm0(drm_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    var len0 = WASM_VECTOR_LEN
    wasm.render_image(addBorrowedObject(obfuscated_image), addBorrowedObject(ctx), ptr0, len0)
  } finally {
    heap[stack_pointer++] = undefined
    heap[stack_pointer++] = undefined
  }
  return ret
}

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1)
  const idx = heap_next
  heap_next = heap[idx]

  heap[idx] = obj
  return idx
}

function handleError(f, args) {
  try {
    return f.apply(this, args)
  } catch (e) {
    wasm.__wbindgen_exn_store(addHeapObject(e))
  }
}

export function __wbindgen_object_drop_ref(arg0) {
  takeObject(arg0)
}

export function __wbg_drawImage_6d85246495d68bc3() {
  return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    ret.push([arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9])
    // getObject(arg0).drawImage(getObject(arg1), arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
  }, arguments)
}

export function __wbg_width_dd6eae8d0018c715(arg0) {
  // var ret = getObject(arg0).width;
  // return ret;
  return 1115
}

export function __wbg_new_693216e109162396() {
  var ret = new Error()
  return addHeapObject(ret)
}

export function __wbg_stack_0ddaca5d1abfb52f(arg0, arg1) {
  var ret = getObject(arg1).stack
  var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
  var len0 = WASM_VECTOR_LEN
  getInt32Memory0()[arg0 / 4 + 1] = len0
  getInt32Memory0()[arg0 / 4 + 0] = ptr0
}

export function __wbg_error_09919627ac0992f5(arg0, arg1) {
  try {
    console.error(getStringFromWasm0(arg0, arg1))
  } finally {
    wasm.__wbindgen_free(arg0, arg1)
  }
}

export function __wbindgen_debug_string(arg0, arg1) {
  var ret = debugString(getObject(arg1))
  var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
  var len0 = WASM_VECTOR_LEN
  getInt32Memory0()[arg0 / 4 + 1] = len0
  getInt32Memory0()[arg0 / 4 + 0] = ptr0
}

export function __wbindgen_throw(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1))
}
