import Expo from "expo-server-sdk";
let expo = new Expo();

Parse.Cloud.beforeSave("Alarms", async function(req, res) {
  if (!req.object.isNew()) {
    return res.success();
  }

  const query = new Parse.Query("_User");
  query.equalTo("objectId", req.object.get("haaj"));
  query.include("manager");

  const manager = await query.first();

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
