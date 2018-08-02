import Expo from "expo-server-sdk";
let expo = new Expo();

Parse.Cloud.beforeSave("Alarms", async function(req, res) {
  if (!req.object.isNew()) {
    return res.success();
  }

  // find haaj
  const haajQuery = new Parse.Query("Haaj");
  query.equalTo("qr", reg.object.get("qr"));
  const haaj = await haajQuery.first();

  if (!haaj) {
    res.error({
      error: "لم يتم العثور على الحاج"
    });
  }

  const query = new Parse.Query("_User");
  query.equalTo("objectId", haaj.get("objectId"));
  query.include("manager");

  const manager = await query.first();

  req.object.set("maanger", manager);

  if (manager) {
    let messages = manager
      .get("tokens")
      .filter(token => Expo.isExpoPushToken(token));
    messages = messages.map(token => ({
      to: token,
      sound: "default",
      body: `تم العثور على الحاج ضمن مجموعتك - ${req.body.get("message")}`
    }));
    expo.sendPushNotificationsAsync(messages);
  }

  res.success();
});
