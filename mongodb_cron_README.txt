# MongoDB Auto-Stop Cron Configuration
# ======================================
#
# This cron job runs every 10 minutes (144 reads/day).
# It checks active MongoDB connections and stops MongoDB
# if no application is connected (idle).
#
# SETUP INSTRUCTIONS:
#
# 1. Make the script executable:
#      chmod +x /path/to/mongodb_cron.sh
#
# 2. Add the cron job (run as root or with sudo):
#      sudo crontab -e
#
# 3. Paste this line:
#      */10 * * * * /path/to/mongodb_cron.sh
#
# CRON EXPRESSION BREAKDOWN:
#   */10  = every 10 minutes
#   *     = every hour
#   *     = every day of month
#   *     = every month
#   *     = every day of week
#
# LOGIC:
#   - Reads db.serverStatus().connections.current
#   - If connections <= 1 (no app connected) → stops MongoDB
#   - If connections > 1 (app active) → keeps MongoDB running
#
# DAILY READS: 1440 min / 10 = 144 read requests per day
#
# LOG FILE: /var/log/mongodb_cron.log
