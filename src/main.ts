import build_ast from "./plugins/ast";
import exec_bf_once from "./plugins/executor";


function _run_bf(
  nodes: Array<any>,
  mem: number[],
  cur: number,
  out: string,
  max_val: number
): [boolean, string, number[], number] {
  for (const node of nodes) {
    if (typeof node === "string") {
      const res = exec_bf_once(node, {
        memory: mem,
        cursor: cur,
        max_value: max_val,
      });
      if (!res.success) {
        return [false, out, mem, cur];
      }
      mem = res.memory;
      cur = res.cursor;
      out = out + res.output;
    } else if (Array.isArray(node)) {
      let guard = 0;
      const MAX_ITER = 1_000_000;
      while (mem[cur] !== 0) {
        if (guard++ > MAX_ITER) {
          return [false, out, mem, cur];
        }
        const [ok2, out2, mem2, cur2] = _run_bf(node, mem, cur, out);
        if (!ok2) {
          return [false, out2, mem2, cur2];
        }
        mem = mem2;
        cur = cur2;
        out = out2;
      }
    }
  }
  return [true, out, mem, cur];
};

export default function brainfuck(
  code: string,
  {
    tape_size = 256,
    max_val = 255,
  }: {
    tape_size?: number;
    max_val?: number;
  } = {}
): [boolean, string] {
  const [ok, ast] = build_ast(code);
  if (!ok) {
    return [false, ""];
  }

  let memory: number[] = new Array(tape_size).fill(0);
  let cursor = 0;
  let output = "";

  const [success, finalOut] = _run_bf(ast, memory, cursor, output, max_val);
  return [success, finalOut];
}
