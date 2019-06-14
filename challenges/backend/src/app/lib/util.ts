import { sha512 } from "js-sha512";

export class Util {
  public static hashPasswordWithCycles(
    plainTextPassword: string,
    cycles: number
  ): string {
    let hash = `${plainTextPassword}`;
    for (let i = 0; i < cycles; i++) {
      hash = sha512(hash);
    }

    return hash;
  }
}
