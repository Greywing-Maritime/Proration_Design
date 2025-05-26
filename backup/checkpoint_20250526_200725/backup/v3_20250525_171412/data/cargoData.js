// Cargo Operations Data for CHEMROAD JOURNEY Voyage 124
// Based on proration calculations with "block time minus deductions" methodology

export const vesselInfo = {
  vessel: "CHEMROAD JOURNEY",
  voyage: 124,
  totalVoyageDuration: "22 days",
  ports: ["Kuala Tanjung", "Kandla", "Port Qasim"]
};

// Chemical abbreviations and UN load codes for compact display
export const abbreviations = {
  chemicals: {
    "Fatty Acid": "FA",
    "Stearin": "STE", 
    "Palm Olein": "PO",
    "Palm Oil": "PO",
    "Palm Stearin": "PS",
    "Soft Stearin": "SS",
    "Sulfuric Acid": "SUA"
  },
  ports: {
    "Kuala Tanjung": "IDKTG", // UN/LOCODE for Kuala Tanjung
    "Kandla": "INKDL",        // UN/LOCODE for Kandla
    "Port Qasim": "PKPQM",    // UN/LOCODE for Port Qasim
    "Unknown": "UNK"
  }
};

// CORRECTED: Only 2 Unilever cargoes as per laytime statement
// Each cargo represents multiple tanks but shown as single line
export const cargoTypes = {
  // Fatty Acid (loaded in tanks 5P,7W)
  CARGO1: { 
    name: "Fatty Acid", 
    abbreviation: "FA",
    charterer: "UNILEVER", 
    color: "#e91e63",
    ports: ["Kuala Tanjung", "Kandla"],
    loadPort: "Kuala Tanjung",
    loadPortCode: "IDKTG",
    dischargePort: "Kandla",
    dischargePortCode: "INKDL",
    quantity: "5,001.866 MT",
    tanks: ["5P", "7W"], // Tanks used for this cargo
    tankDesignation: "5P,7W"
  },
  // Stearin (loaded in tanks 5S,6P)
  CARGO2: { 
    name: "Stearin", 
    abbreviation: "STE",
    charterer: "UNILEVER", 
    color: "#9c27b0",
    ports: ["Kuala Tanjung", "Port Qasim"],
    loadPort: "Kuala Tanjung",
    loadPortCode: "IDKTG", 
    dischargePort: "Port Qasim",
    dischargePortCode: "PKPQM",
    quantity: "3,003.315 MT",
    tanks: ["5S", "6P"], // Tanks used for this cargo
    tankDesignation: "5S,6P"
  },
  // OTHER Charterer Cargoes
  OTHER_4S: { 
    name: "Palm Stearin", 
    abbreviation: "PS",
    charterer: "OTHER", 
    color: "#00782a",
    ports: ["Port Qasim"],
    loadPort: "Unknown",
    loadPortCode: "UNK",
    dischargePort: "Port Qasim",
    dischargePortCode: "PKPQM",
    quantity: "1,200 MT",
    tanks: ["4S"],
    tankDesignation: "4S"
  },
  OTHER_6S: { 
    name: "Soft Stearin", 
    abbreviation: "SS",
    charterer: "OTHER", 
    color: "#2196f3",
    ports: ["Port Qasim"],
    loadPort: "Unknown",
    loadPortCode: "UNK",
    dischargePort: "Port Qasim",
    dischargePortCode: "PKPQM",
    quantity: "1,600 MT",
    tanks: ["6S"],
    tankDesignation: "6S"
  },
  OTHER_8W: { 
    name: "Palm Olein", 
    abbreviation: "PO",
    charterer: "OTHER", 
    color: "#ff6600",
    ports: ["Port Qasim"],
    loadPort: "Unknown",
    loadPortCode: "UNK",
    dischargePort: "Port Qasim",
    dischargePortCode: "PKPQM",
    quantity: "2,500 MT",
    tanks: ["8W"],
    tankDesignation: "8W"
  },
  OTHER_9W: { 
    name: "Palm Oil", 
    abbreviation: "PO",
    charterer: "OTHER", 
    color: "#ffd320",
    ports: ["Port Qasim"],
    loadPort: "Unknown",
    loadPortCode: "UNK",
    dischargePort: "Port Qasim",
    dischargePortCode: "PKPQM",
    quantity: "3,000 MT",
    tanks: ["9W"],
    tankDesignation: "9W"
  }
};

// Port Operations Data
export const portOperations = {
  "Kuala Tanjung": {
    country: "Indonesia",
    berth: "KTMT",
    theme: "#e91e63",
    timeline: [
      {
        time: "26 Apr 09:30",
        event: "Arrival (EOSP)",
        type: "shared",
        timeType: "waiting",
        activeCargoes: ["CARGO1", "CARGO2"],
        duration: "4h 05m"
      },
      {
        time: "26 Apr 13:35",
        event: "Notice of Readiness Tendered",
        type: "shared",
        timeType: "waiting",
        activeCargoes: ["CARGO1", "CARGO2"],
        duration: "25m"
      },
      {
        time: "26 Apr 14:00",
        event: "Granted Free Pratique",
        type: "shared",
        timeType: "waiting",
        activeCargoes: ["CARGO1", "CARGO2"],
        duration: "50m"
      },
      {
        time: "26 Apr 14:50",
        event: "Commenced Shifting",
        type: "shared",
        timeType: "deduction",
        activeCargoes: ["CARGO1", "CARGO2"],
        duration: "1h 55m"
      },
      {
        time: "26 Apr 16:45",
        event: "Made Fast (Laytime Commences)",
        type: "shared",
        timeType: "laytime",
        activeCargoes: ["CARGO1", "CARGO2"],
        duration: "ongoing"
      },
      {
        time: "26 Apr 22:45",
        event: "5P,7W Hose Connected",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["CARGO1"],
        cargo: "CARGO1",
        duration: "5h 20m"
      },
      {
        time: "27 Apr 01:30",
        event: "5P,7W Loading Commenced",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["CARGO1"],
        cargo: "CARGO1",
        duration: "21h 15m"
      },
      {
        time: "27 Apr 22:45",
        event: "5S,6P Hose Connected",
        type: "individual", 
        timeType: "laytime",
        activeCargoes: ["CARGO2"],
        cargo: "CARGO2",
        duration: "3h 50m"
      },
      {
        time: "28 Apr 02:35",
        event: "5S,6P Loading Commenced",
        type: "individual",
        timeType: "laytime", 
        activeCargoes: ["CARGO2"],
        cargo: "CARGO2",
        duration: "15h 25m"
      },
      {
        time: "28 Apr 08:00",
        event: "5P,7W Operations Complete",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["CARGO1"],
        cargo: "CARGO1",
        duration: "0m"
      },
      {
        time: "28 Apr 19:00",
        event: "5S,6P Operations Complete (Laytime Ends)",
        type: "shared",
        timeType: "laytime",
        activeCargoes: ["CARGO1", "CARGO2"],
        duration: "0m"
      },
      {
        time: "28 Apr 21:00",
        event: "Departure",
        type: "shared",
        timeType: "post-ops",
        activeCargoes: ["CARGO1", "CARGO2"],
        duration: "0m"
      }
    ],
    laytimeCalculation: {
      totalLaytime: "50h 15m",
      unileverShare: "100%",
      blockTimeMethod: true
    },
    transitToNext: {
      destination: "Kandla",
      duration: "7d 15h 50m"
    }
  },

  "Kandla": {
    country: "India", 
    berth: "OJ-4",
    theme: "#9c27b0",
    timeline: [
      {
        time: "06 May 01:20",
        event: "Arrival (EOSP)",
        type: "shared",
        timeType: "waiting",
        activeCargoes: ["CARGO1"],
        duration: "8h 00m"
      },
      {
        time: "06 May 09:20",
        event: "Notice of Readiness Tendered",
        type: "shared",
        timeType: "waiting",
        activeCargoes: ["CARGO1"],
        duration: "6h 00m"
      },
      {
        time: "06 May 15:20",
        event: "Laytime Commences (NOR+6hrs)",
        type: "shared",
        timeType: "laytime",
        activeCargoes: ["CARGO1"],
        duration: "3d 09h 30m"
      },
      {
        time: "10 May 00:50",
        event: "Commenced Shifting",
        type: "shared",
        timeType: "deduction",
        activeCargoes: ["CARGO1"],
        duration: "4h 15m"
      },
      {
        time: "10 May 05:05",
        event: "Made Fast at Berth",
        type: "shared",
        timeType: "laytime",
        activeCargoes: ["CARGO1"],
        duration: "2h 35m"
      },
      {
        time: "10 May 07:40",
        event: "5P,7W Discharging Commenced",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["CARGO1"],
        cargo: "CARGO1",
        duration: "21h 20m"
      },
      {
        time: "11 May 05:00",
        event: "Squeegeeing 5P,7W (Deduction)",
        type: "individual",
        timeType: "deduction",
        activeCargoes: ["CARGO1"],
        cargo: "CARGO1",
        duration: "15m"
      },
      {
        time: "11 May 05:50",
        event: "5P,7W Operations Complete (Laytime Ends)",
        type: "shared",
        timeType: "laytime",
        activeCargoes: ["CARGO1"],
        duration: "0m"
      },
      {
        time: "11 May 06:00",
        event: "Departure",
        type: "shared",
        timeType: "post-ops",
        activeCargoes: ["CARGO1"],
        duration: "0m"
      }
    ],
    laytimeCalculation: {
      grossTime: "110h 30m",
      deductions: "4h 30m",
      netLaytime: "106h 00m", 
      unileverShare: "100%",
      blockTimeMethod: true
    },
    transitToNext: {
      destination: "Port Qasim",
      duration: "16h 10m"
    }
  },

  "Port Qasim": {
    country: "Pakistan",
    berth: "LCT", 
    theme: "#2196f3",
    timeline: [
      {
        time: "12 May 03:30",
        event: "Arrival (EOSP)",
        type: "shared",
        timeType: "waiting",
        activeCargoes: [],
        duration: "2h 15m"
      },
      {
        time: "12 May 05:45",
        event: "Notice of Readiness Tendered",
        type: "shared",
        timeType: "waiting",
        activeCargoes: [],
        duration: "4d 06h 45m"
      },
      {
        time: "12 May 11:45",
        event: "Laytime Can Commence (NOR+6hrs)",
        type: "shared",
        timeType: "waiting",
        activeCargoes: [],
        duration: "3d 21h 45m"
      },
      {
        time: "16 May 12:30",
        event: "Commenced Shifting",
        type: "shared",
        timeType: "deduction",
        activeCargoes: [],
        duration: "4h 40m"
      },
      {
        time: "16 May 17:10",
        event: "Made Fast at Berth",
        type: "shared",
        timeType: "waiting",
        activeCargoes: [],
        duration: "1h 45m"
      },
      {
        time: "16 May 18:55",
        event: "All Preparations Complete",
        type: "shared",
        timeType: "waiting",
        activeCargoes: [],
        duration: "12h 40m"
      },
      {
        time: "17 May 07:35",
        event: "Other Charterer Operations Start",
        type: "shared",
        timeType: "non-unilever",
        activeCargoes: ["OTHER_4S", "OTHER_6S", "OTHER_8W", "OTHER_9W"],
        duration: "5h 10m"
      },
      {
        time: "17 May 07:35",
        event: "4S Discharging Commenced",
        type: "individual",
        timeType: "non-unilever",
        activeCargoes: ["OTHER_4S", "OTHER_6S", "OTHER_8W", "OTHER_9W"],
        cargo: "OTHER_4S",
        duration: "5h 10m"
      },
      {
        time: "17 May 08:45",
        event: "4S Operations Complete",
        type: "individual",
        timeType: "non-unilever",
        activeCargoes: ["OTHER_6S", "OTHER_8W", "OTHER_9W"],
        cargo: "OTHER_4S",
        duration: "0m"
      },
      {
        time: "17 May 07:35",
        event: "6S Discharging Commenced",
        type: "individual",
        timeType: "non-unilever",
        activeCargoes: ["OTHER_4S", "OTHER_6S", "OTHER_8W", "OTHER_9W"],
        cargo: "OTHER_6S",
        duration: "5h 10m"
      },
      {
        time: "17 May 09:30",
        event: "6S Operations Complete",
        type: "individual",
        timeType: "non-unilever",
        activeCargoes: ["OTHER_8W", "OTHER_9W"],
        cargo: "OTHER_6S",
        duration: "0m"
      },
      {
        time: "17 May 07:35",
        event: "8W Discharging Commenced",
        type: "individual",
        timeType: "non-unilever",
        activeCargoes: ["OTHER_4S", "OTHER_6S", "OTHER_8W", "OTHER_9W"],
        cargo: "OTHER_8W",
        duration: "5h 10m"
      },
      {
        time: "17 May 10:45",
        event: "8W Operations Complete",
        type: "individual",
        timeType: "non-unilever",
        activeCargoes: ["OTHER_9W"],
        cargo: "OTHER_8W",
        duration: "0m"
      },
      {
        time: "17 May 07:35",
        event: "9W Discharging Commenced",
        type: "individual",
        timeType: "non-unilever",
        activeCargoes: ["OTHER_4S", "OTHER_6S", "OTHER_8W", "OTHER_9W"],
        cargo: "OTHER_9W",
        duration: "5h 10m"
      },
      {
        time: "17 May 12:00",
        event: "9W Operations Complete",
        type: "individual",
        timeType: "non-unilever",
        activeCargoes: [],
        cargo: "OTHER_9W",
        duration: "0m"
      },
      {
        time: "17 May 12:45",
        event: "Other Charterer Operations Complete",
        type: "shared",
        timeType: "non-unilever",
        activeCargoes: ["OTHER_4S", "OTHER_6S", "OTHER_8W", "OTHER_9W"],
        duration: "0m"
      },
      {
        time: "17 May 12:45",
        event: "5S,6P Hose Connected (UNILEVER)",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["CARGO2"],
        cargo: "CARGO2",
        duration: "30m"
      },
      {
        time: "17 May 13:15",
        event: "5S,6P Discharging Commenced (UNILEVER)",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["CARGO2"],
        cargo: "CARGO2",
        duration: "8h 15m"
      },
      {
        time: "17 May 21:30",
        event: "Squeegeeing 6P (Deduction)",
        type: "individual",
        timeType: "deduction",
        activeCargoes: ["CARGO2"],
        cargo: "CARGO2",
        duration: "10m"
      },
      {
        time: "17 May 21:40",
        event: "5S,6P Operations Complete (UNILEVER)",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["CARGO2"],
        cargo: "CARGO2",
        duration: "0m"
      },
      {
        time: "18 May 11:00",
        event: "All Operations Complete",
        type: "shared",
        timeType: "post-ops",
        activeCargoes: [],
        duration: "0m"
      },
      {
        time: "18 May 13:00",
        event: "Departure",
        type: "shared",
        timeType: "post-ops",
        activeCargoes: [],
        duration: "0m"
      }
    ],
    laytimeCalculation: {
      totalPortTime: "5d 23h 15m",
      proration: {
        unilever: "13.0553%",
        other: "86.9447%"
      },
      unileverLaytime: "21h 39m",
      unileverDeductions: "108h 16m",
      blockTimeMethod: true
    }
  }
};

// Time tracking data for proration analysis
export const timeTracking = {
  "Kuala Tanjung": {
    totalTime: "50h 15m",
    breakdown: {
      "7W": {
        laytime: "36h 39m",
        waiting: "5h 20m", 
        deductions: "1h 55m",
        percentage: 72.9
      },
      "6P": {
        laytime: "24h 08m",
        waiting: "5h 20m",
        deductions: "1h 55m", 
        percentage: 47.9
      }
    },
    chartererSplit: {
      unilever: 100,
      other: 0
    }
  },
  
  "Kandla": {
    totalTime: "106h 00m",
    breakdown: {
      "7W": {
        laytime: "106h 00m",
        waiting: "14h 00m",
        deductions: "4h 30m",
        percentage: 100
      }
    },
    chartererSplit: {
      unilever: 100,
      other: 0
    }
  },

  "Port Qasim": {
    totalTime: "129h 55m",
    breakdown: {
      "8W": {
        laytime: "27h 25m", 
        waiting: "86h 45m",
        deductions: "3h 54m",
        percentage: 21.1
      },
      "9W": {
        laytime: "22h 45m",
        waiting: "86h 45m", 
        deductions: "3h 54m",
        percentage: 17.5
      },
      "4S": {
        laytime: "20h 30m",
        waiting: "86h 45m",
        deductions: "3h 54m", 
        percentage: 15.8
      },
      "6S": {
        laytime: "18h 15m",
        waiting: "86h 45m",
        deductions: "3h 54m",
        percentage: 14.0
      }
    },
    chartererSplit: {
      unilever: 13.1,
      other: 86.9
    }
  }
};

// Tank-level data for the cargo status modal
export const tankData = {
  // Fatty Acid - Tank 5P
  TANK_5P: { 
    name: "Fatty Acid", 
    abbreviation: "FA",
    charterer: "UNILEVER", 
    color: "#e91e63",
    ports: ["Kuala Tanjung", "Kandla"],
    loadPort: "Kuala Tanjung",
    loadPortCode: "IDKTG",
    dischargePort: "Kandla",
    dischargePortCode: "INKDL",
    quantity: "5,001.866 MT", // Total for both tanks
    cargoHold: "5P", 
    tankDesignation: "5P",
    parentCargo: "CARGO1"
  },
  // Fatty Acid - Tank 7W
  TANK_7W: { 
    name: "Fatty Acid", 
    abbreviation: "FA",
    charterer: "UNILEVER", 
    color: "#e91e63",
    ports: ["Kuala Tanjung", "Kandla"],
    loadPort: "Kuala Tanjung",
    loadPortCode: "IDKTG",
    dischargePort: "Kandla",
    dischargePortCode: "INKDL",
    quantity: "5,001.866 MT", // Total for both tanks
    cargoHold: "7W", 
    tankDesignation: "7W",
    parentCargo: "CARGO1"
  },
  // Stearin - Tank 5S  
  TANK_5S: { 
    name: "Stearin", 
    abbreviation: "STE",
    charterer: "UNILEVER", 
    color: "#9c27b0",
    ports: ["Kuala Tanjung", "Port Qasim"],
    loadPort: "Kuala Tanjung",
    loadPortCode: "IDKTG", 
    dischargePort: "Port Qasim",
    dischargePortCode: "PKPQM",
    quantity: "3,003.315 MT", // Total for both tanks
    cargoHold: "5S", 
    tankDesignation: "5S",
    parentCargo: "CARGO2"
  },
  // Stearin - Tank 6P
  TANK_6P: { 
    name: "Stearin", 
    abbreviation: "STE",
    charterer: "UNILEVER", 
    color: "#9c27b0",
    ports: ["Kuala Tanjung", "Port Qasim"],
    loadPort: "Kuala Tanjung",
    loadPortCode: "IDKTG", 
    dischargePort: "Port Qasim",
    dischargePortCode: "PKPQM",
    quantity: "3,003.315 MT", // Total for both tanks
    cargoHold: "6P", 
    tankDesignation: "6P",
    parentCargo: "CARGO2"
  },
  // OTHER Charterer Tanks
  TANK_4S: { 
    name: "Palm Stearin", 
    abbreviation: "PS",
    charterer: "OTHER", 
    color: "#00782a",
    ports: ["Port Qasim"],
    loadPort: "Unknown",
    loadPortCode: "UNK",
    dischargePort: "Port Qasim",
    dischargePortCode: "PKPQM",
    quantity: "1,200 MT",
    cargoHold: "4S",
    tankDesignation: "4S",
    parentCargo: "OTHER_4S"
  },
  TANK_6S: { 
    name: "Soft Stearin", 
    abbreviation: "SS",
    charterer: "OTHER", 
    color: "#2196f3",
    ports: ["Port Qasim"],
    loadPort: "Unknown",
    loadPortCode: "UNK",
    dischargePort: "Port Qasim",
    dischargePortCode: "PKPQM",
    quantity: "1,600 MT",
    cargoHold: "6S",
    tankDesignation: "6S",
    parentCargo: "OTHER_6S"
  },
  TANK_8W: { 
    name: "Palm Olein", 
    abbreviation: "PO",
    charterer: "OTHER", 
    color: "#ff6600",
    ports: ["Port Qasim"],
    loadPort: "Unknown",
    loadPortCode: "UNK",
    dischargePort: "Port Qasim",
    dischargePortCode: "PKPQM",
    quantity: "2,500 MT",
    cargoHold: "8W",
    tankDesignation: "8W",
    parentCargo: "OTHER_8W"
  },
  TANK_9W: { 
    name: "Palm Oil", 
    abbreviation: "PO",
    charterer: "OTHER", 
    color: "#ffd320",
    ports: ["Port Qasim"],
    loadPort: "Unknown",
    loadPortCode: "UNK",
    dischargePort: "Port Qasim",
    dischargePortCode: "PKPQM",
    quantity: "3,000 MT",
    cargoHold: "9W",
    tankDesignation: "9W",
    parentCargo: "OTHER_9W"
  }
}; 