import Vue from "vue";
import Vuex from "vuex";

//import server data
import serverConfig from "./serverConfig.module";

//import auth from "./auth.module";
import htmlClass from "./htmlclass.module";
import config from "./config.module";
import breadcrumbs from "./breadcrumbs.module";
import profile from "./profile.module";
import berthMonitoring from "./berthMonitoring.module";
import berthplanning from "./berthplanning.module";
import concept from "./concept.module";
import linewindowplanning from "./linewindowplanning.module";
import voyagesof from "./voyagesof.module";
import country from "./country.module";
import dock from "./terminal.module";
import port from "./port.module";
import berth from "./berth.module";
import bollard from "./bollard.module";
import vessel from "./vessel.module";
import voyage from "./voyage.module";
import voyageDetail from "./voyageDetail.module";
import noneWorking from "./noneWorking.module";
import company from "./company.module";
import companyLineService from "./companyLineService.module";
import dashboard from "./dashboard.module";
import setting from "./setting.module";
import usersetting from "./usersetting.module";
import lineWindow from "./lineWindow.module";
import lineWindowPattern from "./lineWindowPattern.module";
import legacyBridgeModule from "./legacy-bridge.module";
import vesselProfile from "./vesselProfile.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    // selected server
    serverConfig,
    berthMonitoring,

    //auth,
    htmlClass,
    config,
    breadcrumbs,
    profile,
    country,
    berthplanning,
    concept,
    linewindowplanning,
    voyagesof,
    port,
    dock,
    berth,
    bollard,
    vessel,
    vesselProfile,
    voyage,
    voyageDetail,
    noneWorking,
    company,
    companyLineService,
    dashboard,
    setting,
    usersetting,
    lineWindow,
    lineWindowPattern,
    legacyBridgeModule,
  },
});
