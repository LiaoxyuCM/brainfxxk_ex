import donothing from "./plugins/donothing";
import macro_comment_process from "./plugins/macro_comment_processor";

export const processor = {
  donothing,
  macro_comment_process
}

export default function brainfuck(
  code: string,
  input: string = "",
  preprocessor: (code: string) => [boolean, string] = donothing // 改为macro_comment_process
): [boolean, string] {

  let stat: boolean;
  [stat, code] = preprocessor(code);
  if (!stat) {
    return [false, "Preprocessor exception"]
  }

  const MAX_ITER = 131071;
  const MAX_NUMBER = 255;
  const MEMORY_SIZE = 256;

  let result: string = "";
  let code_cursor: number = -1;
  let cell_cursor: number = 0;
  let input_cursor: number = 0;
  let memory: number[] = new Array(MEMORY_SIZE).fill(0);

  const bracketMap: Map<number, number> = new Map();
  const stack: number[] = [];
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '[') {
      stack.push(i);
    } else if (code[i] === ']') {
      if (stack.length === 0) {
        return [false, "Unmatched ']' at pos " + i];
      }
      const open = stack.pop()!;
      bracketMap.set(open, i);
      bracketMap.set(i, open);
    }
  }
  if (stack.length > 0) {
    return [false, "Unmatched '[' at pos " + stack[stack.length - 1]];
  }

  let iterations: number[] = [];

  while (code_cursor < code.length) {
    if (iterations[iterations.length-1] > MAX_ITER) {
      return [false, `Exec exceeded max iter (${MAX_ITER})`];
    }

    const cmd: string = code[++code_cursor];

    switch (cmd) {
      case '>':
        if (++cell_cursor >= MEMORY_SIZE) {
          cell_cursor = 0;
        }
        break;
      case '<':
        if (--cell_cursor < 0) {
          cell_cursor = MEMORY_SIZE - 1;
        }
        break;
      case '+':
        memory[cell_cursor] = (memory[cell_cursor] + 1) % (MAX_NUMBER + 1);
        break;
      case '-':
        memory[cell_cursor] = (memory[cell_cursor] - 1 + (MAX_NUMBER + 1)) % (MAX_NUMBER + 1);
        break;
      case '.':
        result += String.fromCharCode(memory[cell_cursor]);
        break;
      case ',':
        memory[cell_cursor] = (input[input_cursor++] || "\0").charCodeAt(0);
        break;
      case '[':
        if (memory[cell_cursor] === 0) {
          code_cursor = bracketMap.get(code_cursor)!;
        } else {
          iterations.push(0);
        }
        break;
      case ']':
        if (memory[cell_cursor] !== 0) {
          code_cursor = bracketMap.get(code_cursor)!;
          iterations[iterations.length-1] ++;
        } else {
          iterations.pop();
        }
        break;
    }
  }

  return [true, result];
}
