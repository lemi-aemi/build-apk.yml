#!/bin/sh

PORT="/dev/ttyUSB2"
MODEM_TYPE=$1
IMEI_VALUE=$2

send_at() {
    echo "$1" > "$PORT"
    sleep 1
}

case $MODEM_TYPE in
    "rm520n")
        # Referensi Anda: AT+EGMR=1,7,"IMEI"
        send_at "AT+EGMR=1,7,\"$IMEI_VALUE\""
        send_at "AT+CFUN=1,1"
        ;;
    "dw5821e")
        # Referensi Anda: Hapus -> Restart -> Input Hex -> Restart
        # Catatan: User harus memasukkan format HEX yang sudah jadi di UI
        send_at "at^nv=550,\"0\""
        send_at "at+cfun=1,1"
        sleep 10 # Menunggu modem up kembali
        send_at "at^nv=550,9,\"$IMEI_VALUE\""
        send_at "at+cfun=1,1"
        ;;
    "cek_rm")
        send_at "AT+GSN"
        ;;
    "cek_dw")
        send_at "at^nv=550"
        ;;
esac