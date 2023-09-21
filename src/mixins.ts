// import JwtService from "@/core/services/jwt.service";

export const EnumColors = {
  methods: {
    getvoyagestatus(id) {
      let color = "";
      let colorStatus = "";
      switch (id) {
        case 1: {
          color = "primary";
          colorStatus = "ArrivalNotice";
          break;
        }
        case 2: {
          color = "warning";
          colorStatus = "anchorage";
          break;
        }
        case 3: {
          color = "success";
          colorStatus = "Berth";
          break;
        }
        case 4: {
          color = "danger";
          colorStatus = "Unberth";
          break;
        }
        case 5: {
          color = "info";
          colorStatus = "fullaway";
          break;
        }
        default: {
          color = "";
          colorStatus = "";
          break;
        }
      }
      const class1 = "label-light-" + color;
      const class2 = "label-light-" + colorStatus;
      return class1 + " " + class2;
    },
    getvoyagestatusAlert(id) {
      let colorStatus = "";
      switch (Number(id)) {
        case 1: {
          colorStatus = "ArrivalNotice";
          break;
        }
        case 2: {
          colorStatus = "anchorage";
          break;
        }
        case 3: {
          colorStatus = "Berth";
          break;
        }
        case 4: {
          colorStatus = "Unberth";
          break;
        }
        case 5: {
          colorStatus = "fullaway";
          break;
        }
        default: {
          colorStatus = "";
          break;
        }
      }

      return "alert-" + colorStatus;
    },
    getvesseltype(id) {
      let color = "";
      switch (id) {
        case 1: {
          color = "ContainerShip";
          break;
        }
        case 2: {
          color = "BulkCargo";
          break;
        }
        case 3: {
          color = "OilTanker";
          break;
        }
        case 4: {
          color = "RoRo";
          break;
        }
        case 5: {
          color = "GeneralCargo";
          break;
        }
        case 6: {
          color = "ChemicalTanker";
          break;
        }
        case 7: {
          color = "GasTanker";
          break;
        }
        default: {
          color = "";
          break;
        }
      }
      return "label-light-" + color;
    },
  },
};

export const ImageSRC = {
  methods: {
    getvesseltypesrc(id) {
      let img = "";
      switch (id) {
        case 1: {
          img = "ContainerShip.png";
          break;
        }
        case 2: {
          img = "BulkCargo.png";
          break;
        }
        case 3: {
          img = "OilTanker.png";
          break;
        }
        case 4: {
          img = "Ro-Ro.png";
          break;
        }
        case 5: {
          img = "GeneralCargo.png";
          break;
        }
        case 6: {
          img = "ChemicalTanker.png";
          break;
        }
        case 7: {
          img = "GasTanker.png";
          break;
        }
        default: {
          img = "";
          break;
        }
      }
      return "media/vessels/" + img;
    },
    getvesseltypesrcSVG(id, berthside) {
      let img = "";

      let Startboard = "";
      if (berthside != 1) {
        Startboard = "_Startboard";
      }

      switch (id) {
        case 1: {
          img = "ContainerShip" + Startboard + ".svg";
          break;
        }
        case 2: {
          img = "BulkCargo" + Startboard + ".svg";
          break;
        }
        case 3: {
          img = "OilTanker" + Startboard + ".svg";
          break;
        }
        case 4: {
          img = "Ro-Ro" + Startboard + ".svg";
          break;
        }
        case 5: {
          img = "GeneralCargo" + Startboard + ".svg";
          break;
        }
        case 6: {
          img = "ChemicalTanker" + Startboard + ".svg";
          break;
        }
        case 7: {
          img = "GasTanker" + Startboard + ".svg";
          break;
        }
        default: {
          img = "";
          break;
        }
      }
      return "media/vessels/" + img;
    },

    getCompanyImage(id) {
      return (
        process.env.VUE_APP_BASE_API +
        "/definition/Company/getcompanyimageurl?id=" +
        id
      );
    },
    getflagsrc(flagUNCode) {
      return "/media/flags/" + flagUNCode + ".png";
    },
  },
};

export const ConvertTime = {
  methods: {
    GetOperationTime(num) {
      const days = Math.floor(num / (60 * 24));
      let hours = num % (60 * 24);
      const minutes = hours % 60;
      hours = Math.floor(hours / 60);
      let res = "";
      if (days > 0) {
        res = days + " Day(s)";
      }
      if (hours > 0) {
        if (res != "") {
          res += ", ";
        }
        res += hours + " Hour(s)";
      }
      if (minutes > 0) {
        if (res != "") {
          res += ", ";
        }
        res += minutes + " Minute(s)";
      }
      return res;
    },
    GetPlanDuration(num) {
      const days = Math.floor(num / (60 * 24));
      let hours = num % (60 * 24);
      const minutes = hours % 60;
      hours = Math.floor(hours / 60);
      let res = "";
      if (days > 0) {
        res = days + " D";
      }
      if (hours > 0) {
        if (res != "") {
          res += ", ";
        }
        res += hours + " H";
      }
      if (minutes > 0) {
        if (res != "") {
          res += ", ";
        }
        // @ts-ignore
        res += parseInt(minutes) + " M";
      }
      return res;
    },
  },
};

export const NumberFormat = {
  methods: {
    NumberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
