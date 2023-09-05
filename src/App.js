// import logo from "./logo.svg";
// import "./App.css";
// import { useEffect } from "react";
// import { Web3Wallet } from "@walletconnect/web3wallet";
// import { Core } from "@walletconnect/core";
// import { buildApprovedNamespaces } from "@walletconnect/utils";

// function App() {
//   const core = new Core({
//     projectId: "6e07f4c564866a4ad611a1e20128c4f2",
//   });

//   // const core = new Core({
//   //   projectId: process.env.PROJECT_ID,
//   // });

//   core.on("session_proposal", async (sessionProposal) => {
//     const { id, params } = sessionProposal;

//     // ------- namespaces builder util ------------ //
//     const approvedNamespaces = buildApprovedNamespaces({
//       proposal: params,
//       supportedNamespaces: {
//         eip155: {
//           chains: ["eip155:1", "eip155:137"],
//           methods: ["eth_sendTransaction", "personal_sign"],
//           events: ["accountsChanged", "chainChanged"],
//           accounts: [
//             "eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb",
//             "eip155:137:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb",
//           ],
//         },
//       },
//     });
//     // ------- end namespaces builder util ------------ //

//     const session = await core.approveSession({
//       id,
//       namespaces: approvedNamespaces,
//     });

//     console.log(session, "session");
//   });

//   const connectWallet = async () => {
//     const web3wallet = await Web3Wallet.init({
//       core,
//       metadata: {
//         name: "Demo app",
//         description: "Demo Client as Wallet/Peer",
//         url: "www.walletconnect.com",
//         icons: [],
//       },
//     });

//     console.log(web3wallet, "web3wallet");
//   };

//   useEffect(() => {
//     connectWallet();
//   }, []);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import {
  WalletConnectModalSign,
  useConnect,
} from "@walletconnect/modal-sign-react";
import { useState } from "react";

// 1. Get projectID at https://cloud.walletconnect.com
const projectId = '6e07f4c564866a4ad611a1e20128c4f2';
if (!projectId) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

export default function App() {
  const [disabled, setDisabled] = useState(false);
  const { connect } = useConnect({
    requiredNamespaces: {
      eip155: {
        methods: ["eth_sendTransaction", "personal_sign"],
        chains: ["eip155:1"],
        events: ["chainChanged", "accountsChanged"],
      },
    },
  });

  async function onConnect() {
    try {
      setDisabled(true);
      const session = await connect();
      console.info(session);
    } catch (err) {
      console.error(err);
    } finally {
      setDisabled(false);
    }
  }

  return (
    <>
      <button onClick={onConnect} disabled={disabled}>
        Connect Wallet
      </button>

      {/* Set up WalletConnectModalSign component */}
      <WalletConnectModalSign
        projectId={projectId}
        metadata={{
          name: "My Dapp",
          description: "My Dapp description",
          url: "https://my-dapp.com",
          icons: ["https://my-dapp.com/logo.png"],
        }}
      />
    </>
  );
}
