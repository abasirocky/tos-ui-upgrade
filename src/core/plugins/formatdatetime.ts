import Vue from "vue";
import moment from "moment";

Vue.filter("formatDateWithTime", function(value) {
  if (value && value != undefined && value != null) {
    return moment(String(value)).format("YYYY/MM/DD HH:mm");
  } else {
    return "";
  }
});
Vue.filter("formatDateWithoutTime", function(value) {
  if (value && value != undefined && value != null) {
    return moment(String(value)).format("YYYY/MM/DD");
  } else {
    return "";
  }
});

Vue.filter("formatTime", function(value) {
  if (value) {
    let hours = Number(value.split(':')[0]);
    let HH = hours < 10 ? "0" + hours : hours;
     let minutes = Number(value.split(":")[1]);
     let mm = minutes < 10 ? "0" + minutes : minutes;
    return String(HH + ":" + mm);
  } else {
    return "unknown";
  }
});
