/**
 * Build AST tree
 *
 * `+++++[<+++++>-]<.`
 * =>
 * [
 *   "+++++",
 *   [
 *     "<+++++>-"
 *   ],
 *   "<."
 * ]
 */

import { bracket_check } from "./analyzer";

export default function build_ast(code: string): [boolean, Array<any>] {
  if (!bracket_check(code)) {
    return [false, []];
  }

  const root: Array<any> = [];
  const stack: Array<Array<any>> = [root];
  let buffer = "";

  const flush = () => {
    if (buffer.length > 0) {
      stack[stack.length - 1].push(buffer);
      buffer = "";
    }
  };

  for (const chr of code) {
    switch (chr) {
      case "+": case "-":
      case "<": case ">":
      case ".": case ",":
        buffer += chr;
        break;
      case "[":
        flush();
        const loop: Array<any> = [];
        stack[stack.length - 1].push(loop);
        stack.push(loop);
        break;
      case "]":
        flush();
        stack.pop();
        break;
    }
  }

  flush();

  return [true, root];
}
