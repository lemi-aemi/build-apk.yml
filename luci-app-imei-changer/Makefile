include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-imei-changer
PKG_VERSION:=1.0
PKG_RELEASE:=1
PKG_MAINTAINER:=LemiAemi

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-imei-changer
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=LuCI support for IMEI Changer (RM520N & DW5821e)
  DEPENDS:=+socat
  PKGARCH:=all
endef

define Build/Compile
endef

define Package/luci-app-imei-changer/install
	# 1. Install script backend (Tetap dari folder files jika itu lokasi scriptnya)
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) ./files/set_imei.sh $(1)/usr/bin/set_imei

	# 2. Copy seluruh struktur dari folder root
	# Ini otomatis akan membawa usr/share/luci/menu.d/ dan usr/share/rpcd/acl.d/
	# jika struktur folder di repositori Anda sudah benar.
	if [ -d "./root" ] && [ "$$(ls -A ./root)" ]; then \
		$(CP) ./root/* $(1)/; \
	fi

	# 3. Copy file antarmuka web ke /www/
	$(INSTALL_DIR) $(1)/www
	if [ -d "./htdocs" ] && [ "$$(ls -A ./htdocs)" ]; then \
		$(CP) ./htdocs/* $(1)/www/; \
	fi
endef


$(eval $(call BuildPackage,luci-app-imei-changer))
