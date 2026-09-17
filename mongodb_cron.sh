#!/bin/bash
# MongoDB Auto-Stop Cron Script
# Runs every 10 minutes (144 checks/day)
# Stops MongoDB if there are no active application connections

LOG="/var/log/mongodb_cron.log"

# Check active connections (exclude system/internal connections)
ACTIVE_CONNECTIONS=$(mongosh --quiet --eval "db.serverStatus().connections.current" 2>/dev/null)

if [ -z "$ACTIVE_CONNECTIONS" ]; then
    echo "$(date): MongoDB is not running or unreachable." >> "$LOG"
    exit 0
fi

# MongoDB typically has 1 internal connection minimum
# If connections <= 1, no app is using it → stop
if [ "$ACTIVE_CONNECTIONS" -le 1 ]; then
    echo "$(date): No active app connections ($ACTIVE_CONNECTIONS). Stopping MongoDB..." >> "$LOG"
    sudo systemctl stop mongod 2>/dev/null || sudo service mongod stop 2>/dev/null
    echo "$(date): MongoDB stopped." >> "$LOG"
else
    echo "$(date): MongoDB active ($ACTIVE_CONNECTIONS connections). Keeping alive." >> "$LOG"
fi
