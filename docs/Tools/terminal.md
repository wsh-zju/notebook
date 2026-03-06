# <i class="fa-solid fa-terminal"></i> 终端常用命令

## 硬件

### ubuntu GUI

```bash
sudo apt upgrade
sudo apt install ubuntu-desktop
reboot
```

### 环境配置

1. **RISC-V 工具链**：
   
```bash
# 使用 glibc 标准库的工具链（linux-gnu）
sudo apt install gcc-riscv64-linux-gnu binutils-riscv64-linux-gnu
# 使用 riscv-newlib 的工具链（unknown-elf）
sudo apt install gcc-riscv64-unknown-elf
```

2. **安装依赖**

```bash 
sudo apt install git help2man perl python3 make autoconf g++ flex bison ccache
sudo apt install libgoogle-perftools-dev numactl perl-doc
sudo apt install libfl2
sudo apt install libfl-dev
sudo apt install zlibc zlib1g zlib1g-dev  # zlibc 可能找不到
sudo apt install device-tree-compiler
```

3. **工具链**

```bash 
# 克隆实验仓库
git clone https://git.zju.edu.cn/zju-sys/sys2/sys2-fa25.git
cd sys2-fa25/repo
# 编译工具链
git submodule update --init     # 一次性同步所有的子模块
git submodule update --init riscv-openocd      # 该命令会将 riscv-openocd 仓库 clone 到 riscv-openocd 文件夹
make fw_jump    # 编译 opensbi
make openocd    # 编译安装 openocd 到 /usr/local/bin 中
make ip_gen     # mac
make spike      # 编译安装 spike 模拟器
make verilator  # 编译安装 verilator 工具
```

!!! warning "make openocd 报错"
    如果出现报错

    ```bash
    lucy@lucy:~/sys2-fa25/repo$ make openocd
    mkdir -p /home/lucy/sys2-fa25/repo/build/openocd
    cd /home/lucy/sys2-fa25/repo/riscv-openocd; ./bootstrap;
    + aclocal --warnings=all
    configure.ac:32: error: Macro PKG_PROG_PKG_CONFIG is not available. It is usually defined in file pkg.m4 provided by package pkg-config.
    configure.ac:32: the top level
    autom4te: error: /usr/bin/m4 failed with exit status: 1
    aclocal: error: autom4te failed with exit status: 1
    make: *** [Makefile:71: openocd] Error 1
    ```

    **安装依赖**

    ```bash
    sudo apt update
    sudo apt install -y \
    pkg-config \
    autoconf \
    automake \
    libtool \
    texinfo \
    libusb-1.0-0-dev \
    libftdi1-dev
    ```

    **如果出现`Permission denied`，加`sudo`**

!!! abstract "反相器的电压传输特性"
    ```bash
    # 工具安装
    sudo apt install ngspice
    # SPICE 仿真
    ngspice inv.sp
    ```


!!! abstract "Logisim 电路仿真"
    ```bash
    # 工具安装
    # 安装 java 运行环境，并下载 logisim-evolution
    sudo apt install openjdk-17-jre
    wget https://git.zju.edu.cn/zju-sys/sys1/sys1-sp23/uploads/bed18108ed82dc45f20f435403d8fdef/logisim-evolution-3.8.0-all.jar
    # 启动 Logisim 
    java -jar logisim-evolution-3.8.0-all.jar
    ```

4. **仿真波形图**

```bash
sudo apt install g++ make gtkwave perl-doc
make wave
```

!!! tip "本地更改会被 checkout 覆盖"
    若切换时提示

    ```bash
    error: Your local changes to the following files would be overwritten by checkout:
        include/csr_struct.vh
    Please commit your changes or stash them before you switch branches.
    Aborting
    ```

    请执行如下命令：

    ```bash
    git stash
    git checkout <target>
    git stash pop
    ```
    
    此处的 `<target>` 为切换的目标分支/版本

### vivado

1. **启动**

```bash
# mac 终端
cd /Users/lucy/Downloads/vivado-on-silicon-mac-main/scripts
./start_container.sh
```

2. **下板**

```bash
# mac
# 安装
brew install openfpgaloader
# 烧录程序 以我们所使的FPGA开发板为例
sudo openFPGALoader -b nexys_a7_100 /path/to/name.bit #烧录进SRAM
sudo openFPGALoader -b nexys_a7_100 -f /path/to/name.bit #烧录进FLASH
```

### 串口
```bash
# 连接串口 mac 终端
screen /dev/cu.usbserial-210292B17F701 9600
```


## 软件

!!! info "RISC-V 相关文档"
    [RISC-V 汇编程序员手册](https://github.com/riscv-non-isa/riscv-asm-manual/blob/main/src/asm-manual.adoc)

    [RISC-V 监督模式二进制接口规范](https://github.com/riscv-non-isa/riscv-sbi-doc/releases/download/v2.0/riscv-sbi.pdf)

    [RISC-V 指令集手册：第一卷 非特权架构](https://github.com/riscv/riscv-isa-manual/releases/download/20240411/unpriv-isa-asciidoc.pdf)
    
    [RISC-V 指令集手册：第二卷 特权架构](https://github.com/riscv/riscv-isa-manual/releases/download/20240411/priv-isa-asciidoc.pdf)

### docker 配置工具链
1. **安装 docker**

```bash
# 如果你之前安装过 docker 或者与其不兼容的程序，先删掉
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
# 其次安装依赖
sudo apt-get install apt-transport-https ca-certificates curl gnupg2 software-properties-common
# 配置 GPG 密钥 ( 仅推荐校网下使用 )
curl -fsSL https://mirrors.zju.edu.cn/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
# 添加软件仓库
echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://mirrors.zju.edu.cn/docker-ce/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
# 最后安装
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
# 查看容器信息，如果前面成功安装这里就可以成功显示信息
docker info
```

2. **拉取容器**

```bash
docker pull git.zju.edu.cn:5050/zju-cs-lab/tool/sys:latest
```

3. **启动容器**

`git pull`一下，确保`sys2-sp25`目录下存在`compose.yml`文件，随后进入`sys2-sp25`目录

```bash
# 启动容器
docker compose up -d
```

4. **启动容器的`shell`**

```bash
docker exec -it sys2-fa25-zju-os-code-1 fish
# 成功的话就可以进入终端
```

### 华为云

```bash
ssh root@1.92.90.249
exit    # 退出
```

## 其余常用终端命令
1. **python 虚拟环境**

```bash
# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate
# 退出虚拟环境
deactivate
```

2. **压缩**

```bash
cd /Users/lucy/Downloads/project
zip -r project2.zip project2  -x "*.DS_Store" "_MACOSX"
```

## 项目的构建与运行

1. **进入项目目录** `cd "Lab1_Student I"`
2. **创建 `build` 目录** `mkdir build`
3. **进入 `build`** `cd build`
4. **运行 `cmake`** `cmake ..` （这一步会生成 `Makefile`）
5. **编译** `make` （生成可运行程序）


## 数据库服务器（MySQL）

```bash
sudo /usr/local/mysql/support-files/mysql.server start #启动
/usr/local/mysql/bin/mysql -u root -p #进入数据库
sudo /usr/local/mysql/support-files/mysql.server stop #停止
```
```bash
sudo mysqld_safe --skip-grant-tables & #跳过密码启动
/usr/local/mysql/bin/mysql -u root  #进入数据库
FLUSH PRIVILEGES; #刷新权限
ALTER USER 'root'@'localhost' IDENTIFIED BY 'lucy';  #修改密码
exit; #退出
sudo killall mysqld #结束进程
```