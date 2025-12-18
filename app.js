
const ABI = [
    {
      "inputs": [],
      "name": "organizer",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "validator",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ticketPrice",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalTickets",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "soldTickets",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "tickets",
      "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
      "stateMutability": "view",
      "type": "function"
    },
  
    {
      "inputs": [],
      "name": "buyTicket",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_buyer", "type": "address" }],
      "name": "validateTicket",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  
  const SEPOLIA = 11155111n;
  
  let provider = null;
  let signer = null;
  let contract = null;
  
  const els = {
    btnConnect: document.getElementById("btnConnect"),
    lblAccount: document.getElementById("lblAccount"),
    lblNetwork: document.getElementById("lblNetwork"),
  
    inpAddress: document.getElementById("inpAddress"),
    inpBuyer: document.getElementById("inpBuyer"),
    btnLoad: document.getElementById("btnLoad"),
  
    btnRefresh: document.getElementById("btnRefresh"),
    lblOrg: document.getElementById("lblOrg"),
    lblVal: document.getElementById("lblVal"),
    lblPrice: document.getElementById("lblPrice"),
    lblSold: document.getElementById("lblSold"),
    lblTotal: document.getElementById("lblTotal"),
    lblTicketStatus: document.getElementById("lblTicketStatus"),
  
    btnBuy: document.getElementById("btnBuy"),
    btnValidate: document.getElementById("btnValidate"),
    btnWithdraw: document.getElementById("btnWithdraw"),
  
    outLog: document.getElementById("outLog")
  };
  
  function log(msg) {
    const current = els.outLog.textContent === "-" ? "" : els.outLog.textContent;
    const line = `${msg}`;
    els.outLog.textContent = current ? `${current}\n${line}` : line;
  }
  
  function shortAddr(a) {
    if (!a || a.length < 10) return a || "-";
    return `${a.slice(0, 6)}…${a.slice(-4)}`;
  }
  
  function statusLabel(code) {
    const n = Number(code);
    if (n === 0) return "NONE (0)";
    if (n === 1) return "ACTIVE (1)";
    if (n === 2) return "USED (2)";
    return `UNKNOWN (${n})`;
  }
  
  async function ensureSepolia() {
    const network = await provider.getNetwork();
    els.lblNetwork.textContent = `${network.name} (${network.chainId})`;
    if (network.chainId !== SEPOLIA) {
      log(`⚠️ Ne Sepolia. Dabar: ${network.name} (${network.chainId}). Perjunk į Sepolia (11155111).`);
      return false;
    }
    return true;
  }
  
  async function connect() {
    if (!window.ethereum) {
      alert("MetaMask nerastas. Įsidiek MetaMask extension.");
      return;
    }
  
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.BrowserProvider(window.ethereum);
  
    const active = accounts[0];
    signer = await provider.getSigner(active);
  
    const address = await signer.getAddress();
    els.lblAccount.textContent = address;
  
    await ensureSepolia();
  
    if (!els.inpBuyer.value) els.inpBuyer.value = address;
  
    log(`✅ Connected: ${shortAddr(address)}`);
  
    if (contract) {
      contract = contract.connect(signer);
      log("🔁 Contract perrištas su nauju signeriu.");
    }
  }
  
  async function loadContract() {
    if (!provider) {
      log("❌ Pirma paspausk Connect MetaMask.");
      return;
    }
    const ok = await ensureSepolia();
    if (!ok) return;
  
    const addr = (els.inpAddress.value || "").trim();
    if (!addr || !addr.startsWith("0x") || addr.length < 42) {
      log("❌ Neteisingas sutarties adresas.");
      return;
    }
  
    try {
      contract = new ethers.Contract(addr, ABI, signer ?? provider);
      log(`✅ Contract loaded: ${shortAddr(addr)}`);
      await refreshData();
    } catch (e) {
      log(`❌ Load contract klaida: ${e?.message || e}`);
    }
  }
  
  async function refreshData() {
    if (!contract) {
      log("❌ Pirma paspausk Load contract.");
      return;
    }
  
    try {
      const [org, val, priceWei, sold, total] = await Promise.all([
        contract.organizer(),
        contract.validator(),
        contract.ticketPrice(),
        contract.soldTickets(),
        contract.totalTickets()
      ]);
  
      els.lblOrg.textContent = org;
      els.lblVal.textContent = val;
      els.lblSold.textContent = sold.toString();
      els.lblTotal.textContent = total.toString();
  
      const priceEth = ethers.formatEther(priceWei);
      els.lblPrice.textContent = `${priceEth} ETH (${priceWei.toString()} wei)`;
  
      const buyer = (els.inpBuyer.value || "").trim();
      if (buyer && buyer.startsWith("0x") && buyer.length >= 42) {
        const st = await contract.tickets(buyer);
        els.lblTicketStatus.textContent = statusLabel(st);
      } else {
        els.lblTicketStatus.textContent = "-";
      }
  
      log("🔄 Data refreshed.");
    } catch (e) {
      log(`❌ Refresh klaida: ${e?.shortMessage || e?.message || e}`);
    }
  }
  
  async function buyTicket() {
    if (!contract || !signer) {
      log("❌ Reikia Load contract ir Connect MetaMask.");
      return;
    }
    const ok = await ensureSepolia();
    if (!ok) return;
  
    try {
      const me = await signer.getAddress();
      const priceWei = await contract.ticketPrice();
  
      log(`🧾 buyTicket() iš ${shortAddr(me)} | value=${priceWei.toString()} wei`);
  
      const tx = await contract.buyTicket({ value: priceWei });
      log(`⏳ TX sent: ${tx.hash}`);
      await tx.wait();
  
      log("✅ Ticket nupirktas (tx patvirtintas).");
      await refreshData();
    } catch (e) {
      log(`❌ buyTicket klaida: ${e?.shortMessage || e?.message || e}`);
    }
  }
  
  async function validateTicket() {
    if (!contract || !signer) {
      log("❌ Reikia Load contract ir Connect MetaMask.");
      return;
    }
    const ok = await ensureSepolia();
    if (!ok) return;
  
    const buyer = (els.inpBuyer.value || "").trim();
    if (!buyer || !buyer.startsWith("0x") || buyer.length < 42) {
      log("❌ Įrašyk Buyer adresą (0x...).");
      return;
    }
  
    try {
      const [val, me] = await Promise.all([contract.validator(), signer.getAddress()]);
      if (me.toLowerCase() !== val.toLowerCase()) {
        log(`❌ Not validator. Tu: ${shortAddr(me)} | validator: ${shortAddr(val)}.`);
        log("👉 Perjunk MetaMask į validator account'ą ir pabandyk dar kartą.");
        return;
      }
  
      log(`✅ Validator OK: ${shortAddr(me)}. validateTicket(${shortAddr(buyer)})...`);
  
      const tx = await contract.validateTicket(buyer);
      log(`⏳ TX sent: ${tx.hash}`);
      await tx.wait();
  
      log("✅ Ticket validated (tx patvirtintas).");
      await refreshData();
    } catch (e) {
      log(`❌ validateTicket klaida: ${e?.shortMessage || e?.message || e}`);
    }
  }
  
  async function withdraw() {
    if (!contract || !signer) {
      log("❌ Reikia Load contract ir Connect MetaMask.");
      return;
    }
    const ok = await ensureSepolia();
    if (!ok) return;
  
    try {
      const [org, me] = await Promise.all([contract.organizer(), signer.getAddress()]);
      if (me.toLowerCase() !== org.toLowerCase()) {
        log(`❌ Not organizer. Tu: ${shortAddr(me)} | organizer: ${shortAddr(org)}.`);
        log("👉 Perjunk MetaMask į organizer account'ą ir pabandyk dar kartą.");
        return;
      }
  
      log(`💸 withdraw() iš organizer ${shortAddr(me)}...`);
  
      const tx = await contract.withdraw();
      log(`⏳ TX sent: ${tx.hash}`);
      await tx.wait();
  
      log("✅ Withdraw pavyko (tx patvirtintas).");
      await refreshData();
    } catch (e) {
      log(`❌ withdraw klaida: ${e?.shortMessage || e?.message || e}`);
    }
  }
  
  function wireMetamaskEvents() {
    if (!window.ethereum) return;
  
    window.ethereum.on("accountsChanged", async (accounts) => {
      try {
        if (!accounts || !accounts.length) return;
  
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner(accounts[0]);
        const address = await signer.getAddress();
        els.lblAccount.textContent = address;
  
        if (contract) contract = contract.connect(signer);
  
        log(`🔁 Account changed: ${shortAddr(address)} (signer atnaujintas)`);
        await refreshData().catch(() => {});
      } catch (e) {
        log(`⚠️ accountsChanged klaida: ${e?.message || e}`);
      }
    });
  
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
  }
  

  els.btnConnect.addEventListener("click", connect);
  els.btnLoad.addEventListener("click", loadContract);
  els.btnRefresh.addEventListener("click", refreshData);
  els.btnBuy.addEventListener("click", buyTicket);
  els.btnValidate.addEventListener("click", validateTicket);
  els.btnWithdraw.addEventListener("click", withdraw);
  

  wireMetamaskEvents();
  log("🟦 Ready. 1) Connect MetaMask → 2) Load contract → 3) Refresh / Buy / Validate / Withdraw");
  