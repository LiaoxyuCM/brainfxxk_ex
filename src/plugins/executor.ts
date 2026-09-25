/**
 * Execute BF
 */


export default function exec_bf_once(
  code: string,
  {
    memory = [0],
    cursor = 0,
    max_value = 255,
  }: {
    memory?: number[];
    cursor?: number;
    max_value?: number
  } = {}
): {
  success: boolean;
  output: string;
  memory: number[];
  cursor: number
} {
  let memcopy: number[] = [...memory];
  let result: string = "";

  if (cursor >= memory.length) {
    return {
      success: false,
      output: "",
      memory: memcopy,
      cursor: cursor
    }
  }


  for (const chr of code) {
    switch (chr) {
      case "+":
        if (memcopy[cursor] < max_value) {
          memcopy[cursor] += 1;
        } else {
          memcopy[cursor] = 0;
        }
        break;
      case "-":
        if (memcopy[cursor] > 0) {
          memcopy[cursor] -= 1;
        } else {
          memcopy[cursor] = max_value;
        }
        break;
      case "<":
        if (cursor == 0) {
          cursor = memcopy.length-1;
        } else {
          cursor -= 1;
        }
        break;
      case ">":
        if (cursor == memcopy.length-1) {
          cursor = 0;
        } else {
          cursor += 1;
        }
        break;
      case ".":
        result += String.fromCharCode(memcopy[cursor]);
        break;
    }
  }

  return {
    success: true,
    output: result,
    memory: memcopy,
    cursor: cursor
  }
}
