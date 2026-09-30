export default function macro_comment_process(code: string): [boolean, string] {
  const macros: Map<string, string> = new Map<string, string>();
  let pointer: number = -1;
  let storaged_name: string = "";
  let storaged_body: string = "";
  let result: string = "";

  try {
    while (++pointer < code.length) {
      const chr = code[pointer];
      switch (chr) {
        case "$":
          while (!(["{", "("].includes(code[++pointer]))) {
            storaged_name += code[pointer];
          }
          while (!(["}", ")"].includes(code[++pointer]))) {
            storaged_body += code[pointer];
          }

          if (code[pointer] == "}") {
            macros.set(storaged_name, storaged_body);
          } else if (code[pointer] == ")") {
            result += (macros.get(storaged_name) || "").replaceAll("@", storaged_body);
          }

          storaged_name = "";
          storaged_body = "";

          break;
        case "/":
          if (code[pointer+1] == "*") {
            pointer++;
            while (
              !(code[pointer] == "*" && code[pointer+1] == "/")
              && (pointer+1<code.length)
            ) {
              pointer++;
            }
            pointer++;
          } else {
            result += chr;
          }
          break;
        default:
          result += chr;
          break;
      }
    }
  } catch (_) {
    return [false, ""];
  }

  return [true, result];
}
