import React from "react";

const USER = "";
const TOKEN: string = "";

export interface Token {
  user: string;
  token: string;
}
export function token(): Token {
  return { user: USER, token: TOKEN };
}
