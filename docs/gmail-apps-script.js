const API_INTAKE_URL = "https://your-domain.com/api/intake/opportunities";
const INTAKE_TOKEN = "REPLACE_WITH_INTAKE_TOKEN";
const LABEL_NAME = "crm/oportunidades";

function pushLabeledOpportunities() {
  const label = GmailApp.getUserLabelByName(LABEL_NAME);

  if (!label) {
    throw new Error(`No existe el label ${LABEL_NAME}`);
  }

  const threads = label.getThreads(0, 20);

  threads.forEach((thread) => {
    const messages = thread.getMessages();
    const lastMessage = messages[messages.length - 1];
    const subject = lastMessage.getSubject();
    const body = lastMessage.getPlainBody().slice(0, 4000);
    const proposalDate = Utilities.formatDate(lastMessage.getDate(), Session.getScriptTimeZone(), "yyyy-MM-dd");

    const payload = {
      projectDescription: subject,
      proposalSummary: body,
      proposalSent: proposalDate,
      status: "propuesta",
      source: "gmail",
      metadata: {
        from: lastMessage.getFrom(),
        threadId: thread.getId(),
        messageId: lastMessage.getId()
      }
    };

    const response = UrlFetchApp.fetch(API_INTAKE_URL, {
      method: "post",
      contentType: "application/json",
      headers: {
        "x-intake-token": INTAKE_TOKEN
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    const statusCode = response.getResponseCode();

    if (statusCode >= 200 && statusCode < 300) {
      thread.removeLabel(label);
      thread.addLabel(getOrCreateLabel_("crm/procesadas"));
    } else {
      thread.addLabel(getOrCreateLabel_("crm/error"));
    }
  });
}

function getOrCreateLabel_(name) {
  const existing = GmailApp.getUserLabelByName(name);
  return existing ?? GmailApp.createLabel(name);
}
