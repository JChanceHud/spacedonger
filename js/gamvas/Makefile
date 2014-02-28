VERSION=0.8.7
TARGET=gamvas.js
SRCTARGET=gamvas.debug.js
BUILDDIR=js
DISTDIR=dist/Gamvas-$(VERSION)

SRC=LICENSE.txt gamvas.base.js \
	gamvas.class.js \
	gamvas.config.js \
	gamvas.resource.js \
	gamvas.math.js \
	gamvas.rect.js \
	gamvas.vector2d.js \
	gamvas.dom.js \
	gamvas.event.js \
	gamvas.timer.js \
	gamvas.sound.js \
	gamvas.key.js \
	gamvas.mouse.js \
	gamvas.state.state.js \
	gamvas.state.js \
	gamvas.camera.js \
	gamvas.screen.js \
	gamvas.image.js \
	gamvas.animation.js \
	gamvas.physics.js \
	gamvas.physics.userdata.js \
	gamvas.physics.contactlistener.js \
	gamvas.astar.js \
	gamvas.astarmap.js \
	gamvas.astarnode.js \
	gamvas.astargrid.js \
	gamvas.astargridnode.js \
	gamvas.actorstate.js \
	gamvas.actor.js \
	gamvas.particle.js \
	gamvas.particleemitter.js

all:
	mkdir -p $(BUILDDIR)
	cat $(SRC) $(PRO) > $(BUILDDIR)/$(SRCTARGET)
	yui-compressor --type js $(BUILDDIR)/$(SRCTARGET) > $(BUILDDIR)/$(TARGET).tmp
	cat LICENSE.txt $(BUILDDIR)/$(TARGET).tmp > $(BUILDDIR)/$(TARGET)
	rm -f $(BUILDDIR)/$(TARGET).tmp

clean:
	rm -f $(BUILDDIR)/$(SRCTARGET) $(BUILDDIR)/$(TARGET)

doc: docs
docs:
	NaturalDocs -i . -p doc/en/naturaldocs -xi tutorial -xi demos -xi js -xi dist -xi test -xi doc -o HTML doc/en/html

dist: docs all
	rm -rf dist
	mkdir dist
	mkdir -p $(DISTDIR)/doc/api
	mkdir -p $(DISTDIR)/js
	cp LICENSE.txt README.txt $(DISTDIR)
	cp $(BUILDDIR)/$(TARGET) $(DISTDIR)/js
	cp $(BUILDDIR)/$(SRCTARGET) $(DISTDIR)/js
	cp $(BUILDDIR)/Box2dWeb* $(DISTDIR)/js
	cp -r doc/en/html/* $(DISTDIR)/doc/api
	cp -r demos $(DISTDIR)
	cd dist && zip -9 -r Gamvas-$(VERSION).zip Gamvas-$(VERSION)
