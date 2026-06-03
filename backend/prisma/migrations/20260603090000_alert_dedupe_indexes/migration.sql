CREATE UNIQUE INDEX IF NOT EXISTS "idx_alerts_unresolved_rule_campaign"
ON "alerts" ("tenant_id", "campaign_id", "rule_id")
WHERE "status" <> 'resolved'
  AND "campaign_id" IS NOT NULL
  AND "rule_id" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "idx_notifications_alert_user"
ON "notifications" ("alert_id", "user_id")
WHERE "alert_id" IS NOT NULL;
