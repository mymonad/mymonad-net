.PHONY: build serve test test-html test-links clean

build:
	hugo --gc --minify

serve:
	hugo server -D --bind 0.0.0.0

test: test-html test-links

test-html:
	@chmod +x scripts/test-html.sh
	@./scripts/test-html.sh

test-links:
	@chmod +x scripts/test-links.sh
	@./scripts/test-links.sh

clean:
	rm -rf public/ resources/
