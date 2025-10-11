计算机系统
sudo apt upgrade
sudo apt install ubuntu-desktop

reboot
打开logisim
java -jar logisim-evolution-3.8.0-all.jar

创建工程
xc7a100tcsg324-1

下板验证
sudo openFPGALoader -b nexys_a7_100 /path/to/name.bit #烧录进SRAM
sudo openFPGALoader -b nexys_a7_100 -f /path/to/name.bit #烧录进FLASH

仿真verilator
sudo apt install g++ make gtkwave perl-doc
make
make wave


