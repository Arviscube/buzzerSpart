buzzerdir=`pwd`
echo $buzzerdir
cat $buzzerdir/buzzer.service | sed "s|BUZZERDIR|${buzzerdir}|g" | sudo tee /etc/systemd/system/buzzer.service
echo "okkkkkkkkkk"
sudo chmod 640 /etc/systemd/system/buzzer.service
sudo systemctl daemon-reload
sudo systemctl enable buzzer
sudo systemctl start buzzer
sudo systemctl status buzzer.service
