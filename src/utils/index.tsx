import { useSelector } from "react-redux";
import { State as StoreState } from "../store/reducer";
import { Keypair, Transaction, SystemProgram } from "@solana/web3.js";
import {
  Token,
  TOKEN_PROGRAM_ID,
  AccountLayout,
  NATIVE_MINT,
} from "@solana/spl-token";

export function byteToHexString(uint8arr: any) {
  if (!uint8arr) {
    return "";
  }

  var hexStr = "";
  for (var i = 0; i < uint8arr.length; i++) {
    var hex = (uint8arr[i] & 0xff).toString(16);
    hex = hex.length === 1 ? "0" + hex : hex;
    hexStr += hex;
  }

  return hexStr.toUpperCase();
}

export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function useExplorerQueryString(): string {
  const { queryString } = useSelector((state: StoreState) => {
    const suffix = state.common.network.explorerClusterSuffix;

    if (suffix === "localhost") {
      return {
        queryString:
          "cluster=custom" +
          "&customUrl=" +
          encodeURIComponent("http://127.0.0.1:8899"),
      };
    } else {
      return { queryString: "cluster=" + suffix };
    }
  });

  return queryString;
}

export function createWrappedNativeAccountTx(
  wallet: Keypair,
  newAccount: Keypair,
  minForRentExemption: number,
  feePaidLamports: number
) {
  /**
   * The function provided by the splToken library to create and
   * fund wrapped accounts was not working for us. It seems like
   * it is an Anchor thing because the error said that one account
   * did not have a private key like [u8]. This is a helper
   * function to build the base transaction for the HACKathon.
   */
  const transaction = new Transaction();
  // Create the account
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: newAccount.publicKey,
      lamports: minForRentExemption,
      space: AccountLayout.span,
      programId: TOKEN_PROGRAM_ID,
    })
  );
  // Fund it
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: newAccount.publicKey,
      lamports: feePaidLamports,
    })
  );
  // Assign the account to the native mint
  transaction.add(
    Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      NATIVE_MINT,
      newAccount.publicKey,
      wallet.publicKey
    )
  );

  return transaction;
}
