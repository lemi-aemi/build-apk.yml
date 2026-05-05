#!/bin/sh
# $1 = IMEI atau 'check'
# $2 = Tipe Modem (quectel/dell)

ACTION=$1
MODEM_TYPE=$2

# Tentukan port berdasarkan tipe modem
if [ "$MODEM_TYPE" = "quectel" ]; then
    PORT="/dev/ttyUSB2"
else
    PORT="/dev/ttyUSB1"
fi

# Fungsi kirim AT menggunakan socat
send_at_command() {
    local cmd=$1
    local dev=$2
    # Mengirim perintah dan menunggu respon selama 1 detik
    echo "$cmd" | socat -T 1 - "$dev,crnl" | tr -d '\r'
}

if [ "$ACTION" = "check" ]; then
    echo "[Informasi Modem $MODEM_TYPE]"
    
    # Ambil Model & IMEI
    # Menggunakan grep untuk membersihkan output dari echo perintah itu sendiri
    MODEL=$(send_at_command "ATI" "$PORT" | grep -m 1 "RM520\|DW5821")
    IMEI_NOW=$(send_at_command "AT+CGSN" "$PORT" | grep -E '^[0-9]{15}')
    
    echo "Model: ${MODEL:-Tidak terdeteksi}"
    echo "IMEI Sekarang: ${IMEI_NOW:-Gagal membaca IMEI}"

else
    echo "[Proses Ganti IMEI $MODEM_TYPE]"
    
    if [ "$MODEM_TYPE" = "quectel" ]; then
        # Perintah ganti IMEI Quectel RM520N
        RESPON=$(send_at_command "AT+EGMR=1,7,\"$ACTION\"" "$PORT")
    else
        # Perintah ganti IMEI Dell DW5821e
        RESPON=$(send_at_command "at^nv=550,\"$ACTION\"" "$PORT")
    fi
    
    echo "Respon Modem: $RESPON"
    echo "Selesai. Silakan klik 'Cek Status Modem' untuk verifikasi."
fi
