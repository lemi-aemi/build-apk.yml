#!/bin/sh

ACTION=$1
MODEM=$2
PORT=$3
NEW_IMEI=$4

if [ "$ACTION" = "check" ]; then
    CMD=$(uci -q get imei_changer.main.cmd_check || echo "AT+GSN")
    echo "$CMD" | atinout - "$PORT" -
elif [ "$ACTION" = "change" ]; then
    [ -z "$NEW_IMEI" ] && echo "Error: IMEI harus diisi!" && exit 1
    TEMPLATE=$(uci -q get imei_changer.main.cmd_$MODEM)
    FINAL_CMD=$(echo "$TEMPLATE" | sed "s/{imei}/$NEW_IMEI/g")
    echo "Mengirim: $FINAL_CMD"
    echo "$FINAL_CMD" | atinout - "$PORT" -
fi
