include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-imei-changer
PKG_VERSION:=1.1
PKG_RELEASE:=1
PKG_MAINTAINER:=LemiAemi

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-imei-changer
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=IMEI Changer for RM520N & DW5821e
  DEPENDS:=+socat +modemmanager
  PKGARCH:=all
endef

define Build/Compile
endef

define Package/luci-app-imei-changer/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) ./files/set_imei.sh $(1)/usr/bin/set_imei
	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d
	$(INSTALL_DATA) ./files/luci-menu.json $(1)/usr/share/luci/menu.d/luci-app-imei-changer.json
	$(INSTALL_DIR) $(1)/usr/share/rpcd/acl.d
	$(INSTALL_DATA) ./files/acl.json $(1)/usr/share/rpcd/acl.d/luci-app-imei-changer.json
endef

$(eval $(call BuildPackage,luci-app-imei-changer))