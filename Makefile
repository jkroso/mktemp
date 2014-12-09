
test: node_modules
	@node -p 'require("./").createFileSync("XXXXatemp-file")'
	@node -p 'require("./").createDirSync("XXXXatemp-dir")'
	@node -e 'require("./").createFile("XXXXasync-temp-file", console.log)'
	@node -e 'require("./").createDir("XXXXasync-temp-dir", console.log)'

node_modules: package.json
	@packin install -m $< -f $@
