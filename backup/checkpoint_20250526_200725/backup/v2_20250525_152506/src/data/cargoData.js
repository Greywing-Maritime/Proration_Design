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

export const cargoTypes = {
  SOF1: { 
    name: "Fatty Acid", 
    abbreviation: "FA",
    charterer: "UNILEVER", 
    color: "#e91e63",
    ports: ["Kuala Tanjung"],
    loadPort: "Kuala Tanjung",
    loadPortCode: "IDKTG",
    dischargePort: "N/A",
    dischargePortCode: "N/A",
    quantity: "1,500 MT",
    cargoHold: "7W", // Actual cargo hold where this cargo is stored
    tankDesignation: "7W (6\"x1)"
  },
  SOF2: { 
    name: "Stearin", 
    abbreviation: "STE",
    charterer: "UNILEVER", 
    color: "#9c27b0",
    ports: ["Kuala Tanjung"],
    loadPort: "Kuala Tanjung",
    loadPortCode: "IDKTG", 
    dischargePort: "N/A",
    dischargePortCode: "N/A",
    quantity: "2,000 MT",
    cargoHold: "6P", // Actual cargo hold where this cargo is stored
    tankDesignation: "6P (6\"x1)"
  },
  SOF3: { 
    name: "Fatty Acid", 
    abbreviation: "FA",
    charterer: "UNILEVER", 
    color: "#673ab7",
    ports: ["Kandla"],
    loadPort: "Kuala Tanjung",
    loadPortCode: "IDKTG",
    dischargePort: "Kandla",
    dischargePortCode: "INKDL",
    quantity: "1,800 MT",
    cargoHold: "7W", // Same hold as SOF1, but being discharged
    tankDesignation: "7W (6\"x1)"
  },
  SOF4: { 
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
    cargoHold: "8W", // Assigned cargo hold
    tankDesignation: "8W"
  },
  SOF5: { 
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
    cargoHold: "9W", // Assigned cargo hold
    tankDesignation: "9W"
  },
  SOF6: { 
    name: "Palm Stearin 4S", 
    abbreviation: "PS",
    charterer: "OTHER", 
    color: "#00782a",
    ports: ["Port Qasim"],
    loadPort: "Unknown",
    loadPortCode: "UNK",
    dischargePort: "Port Qasim",
    dischargePortCode: "PKPQM",
    quantity: "1,200 MT",
    cargoHold: "4S", // Actual cargo hold from the data
    tankDesignation: "4S"
  },
  SOF7: { 
    name: "Soft Stearin 6S", 
    abbreviation: "SS",
    charterer: "OTHER", 
    color: "#2196f3",
    ports: ["Port Qasim"],
    loadPort: "Unknown",
    loadPortCode: "UNK",
    dischargePort: "Port Qasim",
    dischargePortCode: "PKPQM",
    quantity: "1,600 MT",
    cargoHold: "6S", // Actual cargo hold from the data
    tankDesignation: "6S"
  },
  SOF8: { 
    name: "Palm Stearin 5S,6P", 
    abbreviation: "PS",
    charterer: "UNILEVER", 
    color: "#e32017",
    ports: ["Port Qasim"],
    loadPort: "Unknown",
    loadPortCode: "UNK",
    dischargePort: "Port Qasim",
    dischargePortCode: "PKPQM",
    quantity: "2,200 MT",
    cargoHold: "5S,6P", // Multiple cargo holds from the data
    tankDesignation: "5S,6P"
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
        activeCargoes: ["SOF1", "SOF2"],
        duration: "4h 05m"
      },
      {
        time: "26 Apr 13:35",
        event: "Notice of Readiness Tendered",
        type: "shared",
        timeType: "waiting",
        activeCargoes: ["SOF1", "SOF2"],
        duration: "25m"
      },
      {
        time: "26 Apr 14:00",
        event: "Granted Free Pratique",
        type: "shared",
        timeType: "waiting",
        activeCargoes: ["SOF1", "SOF2"],
        duration: "50m"
      },
      {
        time: "26 Apr 14:50",
        event: "Commenced Shifting",
        type: "shared",
        timeType: "deduction",
        activeCargoes: ["SOF1", "SOF2"],
        duration: "1h 55m"
      },
      {
        time: "26 Apr 16:45",
        event: "Made Fast (Laytime Commences)",
        type: "shared",
        timeType: "laytime",
        activeCargoes: ["SOF1", "SOF2"],
        duration: "ongoing"
      },
      {
        time: "26 Apr 22:45",
        event: "7W Hose Connected",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["SOF1"],
        cargo: "SOF1",
        duration: "5h 20m"
      },
      {
        time: "27 Apr 01:30",
        event: "7W Loading Commenced",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["SOF1"],
        cargo: "SOF1",
        duration: "21h 15m"
      },
      {
        time: "27 Apr 22:45",
        event: "6P Hose Connected",
        type: "individual", 
        timeType: "laytime",
        activeCargoes: ["SOF2"],
        cargo: "SOF2",
        duration: "3h 50m"
      },
      {
        time: "28 Apr 02:35",
        event: "6P Loading Commenced",
        type: "individual",
        timeType: "laytime", 
        activeCargoes: ["SOF2"],
        cargo: "SOF2",
        duration: "15h 25m"
      },
      {
        time: "28 Apr 08:00",
        event: "7W Operations Complete",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["SOF1"],
        cargo: "SOF1",
        duration: "0m"
      },
      {
        time: "28 Apr 19:00",
        event: "6P Operations Complete (Laytime Ends)",
        type: "shared",
        timeType: "laytime",
        activeCargoes: ["SOF1", "SOF2"],
        duration: "0m"
      },
      {
        time: "28 Apr 21:00",
        event: "Departure",
        type: "shared",
        timeType: "post-ops",
        activeCargoes: ["SOF1", "SOF2"],
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
        activeCargoes: ["SOF3"],
        duration: "8h 00m"
      },
      {
        time: "06 May 09:20",
        event: "Notice of Readiness Tendered",
        type: "shared",
        timeType: "waiting",
        activeCargoes: ["SOF3"],
        duration: "6h 00m"
      },
      {
        time: "06 May 15:20",
        event: "Laytime Commences (NOR+6hrs)",
        type: "shared",
        timeType: "laytime",
        activeCargoes: ["SOF3"],
        duration: "3d 09h 30m"
      },
      {
        time: "10 May 00:50",
        event: "Commenced Shifting",
        type: "shared",
        timeType: "deduction",
        activeCargoes: ["SOF3"],
        duration: "4h 15m"
      },
      {
        time: "10 May 05:05",
        event: "Made Fast at Berth",
        type: "shared",
        timeType: "laytime",
        activeCargoes: ["SOF3"],
        duration: "2h 35m"
      },
      {
        time: "10 May 07:40",
        event: "7W Discharging Commenced",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["SOF3"],
        cargo: "SOF3",
        duration: "21h 20m"
      },
      {
        time: "11 May 05:00",
        event: "Squeegeeing 7W (Deduction)",
        type: "individual",
        timeType: "deduction",
        activeCargoes: ["SOF3"],
        cargo: "SOF3",
        duration: "15m"
      },
      {
        time: "11 May 05:50",
        event: "7W Operations Complete (Laytime Ends)",
        type: "shared",
        timeType: "laytime",
        activeCargoes: ["SOF3"],
        duration: "0m"
      },
      {
        time: "11 May 06:00",
        event: "Departure",
        type: "shared",
        timeType: "post-ops",
        activeCargoes: ["SOF3"],
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
        activeCargoes: ["SOF4", "SOF5", "SOF6", "SOF7", "SOF8"],
        duration: "2h 15m"
      },
      {
        time: "12 May 05:45",
        event: "Notice of Readiness Tendered",
        type: "shared",
        timeType: "waiting",
        activeCargoes: ["SOF4", "SOF5", "SOF6", "SOF7", "SOF8"],
        duration: "4d 06h 45m"
      },
      {
        time: "12 May 11:45",
        event: "Laytime Can Commence (NOR+6hrs)",
        type: "shared",
        timeType: "waiting",
        activeCargoes: ["SOF4", "SOF5", "SOF6", "SOF7", "SOF8"],
        duration: "3d 21h 45m"
      },
      {
        time: "16 May 12:30",
        event: "Commenced Shifting",
        type: "shared",
        timeType: "deduction",
        activeCargoes: ["SOF4", "SOF5", "SOF6", "SOF7", "SOF8"],
        duration: "4h 40m"
      },
      {
        time: "16 May 17:10",
        event: "Made Fast at Berth",
        type: "shared",
        timeType: "waiting",
        activeCargoes: ["SOF4", "SOF5", "SOF6", "SOF7", "SOF8"],
        duration: "1h 45m"
      },
      {
        time: "16 May 18:55",
        event: "All Preparations Complete",
        type: "shared",
        timeType: "waiting",
        activeCargoes: ["SOF4", "SOF5", "SOF6", "SOF7", "SOF8"],
        duration: "12h 40m"
      },
      {
        time: "17 May 07:35",
        event: "8W Operations Start",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["SOF4"],
        cargo: "SOF4",
        duration: "27h 25m"
      },
      {
        time: "17 May 12:15",
        event: "9W Operations Start",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["SOF5"],
        cargo: "SOF5",
        duration: "22h 45m",
        concurrent: ["SOF4"]
      },
      {
        time: "17 May 14:30",
        event: "4S Operations Start", 
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["SOF6"],
        cargo: "SOF6",
        duration: "20h 30m",
        concurrent: ["SOF4", "SOF5"]
      },
      {
        time: "17 May 16:45",
        event: "6S Operations Start",
        type: "individual", 
        timeType: "laytime",
        activeCargoes: ["SOF7"],
        cargo: "SOF7",
        duration: "18h 15m",
        concurrent: ["SOF4", "SOF5", "SOF6"]
      },
      {
        time: "17 May 19:00",
        event: "5S,6P Operations Start",
        type: "individual",
        timeType: "laytime", 
        activeCargoes: ["SOF8"],
        cargo: "SOF8",
        duration: "15h 40m",
        concurrent: ["SOF4", "SOF5", "SOF6", "SOF7"]
      },
      {
        time: "18 May 11:00",
        event: "4S Operations Complete",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["SOF6"],
        cargo: "SOF6",
        duration: "0m"
      },
      {
        time: "18 May 11:00",
        event: "6S Operations Complete", 
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["SOF7"],
        cargo: "SOF7", 
        duration: "0m"
      },
      {
        time: "18 May 11:00",
        event: "9W Operations Complete",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["SOF5"],
        cargo: "SOF5",
        duration: "0m"
      },
      {
        time: "18 May 11:00",
        event: "8W Operations Complete",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["SOF4"],
        cargo: "SOF4",
        duration: "0m"
      },
      {
        time: "18 May 10:40",
        event: "5S,6P Operations Complete",
        type: "individual",
        timeType: "laytime",
        activeCargoes: ["SOF8"],
        cargo: "SOF8",
        duration: "0m"
      },
      {
        time: "18 May 11:30",
        event: "All Operations Complete",
        type: "shared",
        timeType: "post-ops",
        activeCargoes: ["SOF4", "SOF5", "SOF6", "SOF7", "SOF8"],
        duration: "0m"
      },
      {
        time: "18 May 12:00",
        event: "Departure",
        type: "shared",
        timeType: "post-ops",
        activeCargoes: ["SOF4", "SOF5", "SOF6", "SOF7", "SOF8"],
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
      },
      "5S,6P": {
        laytime: "21h 39m",
        waiting: "13h 45m",
        deductions: "108h 16m",
        percentage: 16.7
      }
    },
    chartererSplit: {
      unilever: 13.1,
      other: 86.9
    }
  }
}; 