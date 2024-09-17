import { StreamClient } from "@stream-io/node-sdk";

const apiKey = "djp83vvudx6v";
const apiSecret =
 "f45epbr62uuhhqztqx89pgafv78m84zdevfbb5wrej3um5fvfmhcy74ty3w3d548";

export const client = new StreamClient(apiKey, apiSecret);