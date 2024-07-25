const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @par am {vscode.ExtensionContext} context
 */
function activate(context) {
	const workspaceRoot = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
	if (workspaceRoot) {
		const treeDataProvider = new FileSystemProvider(workspaceRoot);

		const treeView = vscode.window.createTreeView('niner-file-explorer', {
			treeDataProvider,
			canSelectMany: true,
			showCollapseAll: true
		});
	}

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, "niner-menus" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('niner-menus.2214', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello vsCode!');
	});
	context.subscriptions.push(disposable);

	//need to fetch URI
	const temp = vscode.commands.registerCommand('niner-menus.downloadJars', function(){
		vscode.commands.executeCommand("")
	});
	context.subscriptions.push(temp);

}

class FileSystemProvider {
	constructor(workspaceRoot) {
		this.workspaceRoot = workspaceRoot;
		this._onDidChangeTreeData = new vscode.EventEmitter();
		this.onDidChangeTreeData = this._onDidChangeTreeData.event;
	}

	refresh() {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element) {
		return element;
	}

	getChildren(element) {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No workspace folder open.');
			return Promise.resolve([]);
		}

		const dirPath = element ? element.resourceUri.fsPath : this.workspaceRoot;
		return Promise.resolve(this.getFilesAndDirectories(dirPath));
	}

	getFilesAndDirectories(dirPath) {
		if (!fs.existsSync(dirPath)) {
			return [];
		}

		const entries = fs.readdirSync(dirPath).map(name => {
			const fullPath = path.join(dirPath, name);
			const stats = fs.statSync(fullPath);
			return new FileItem(
				vscode.Uri.file(fullPath),
				stats.isDirectory() ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
			);
		});
		return entries;
	}
}

class FileItem extends vscode.TreeItem {
	constructor(resourceUri, collapsibleState) {
		super(resourceUri, collapsibleState);
		this.resourceUri = resourceUri;
		this.collapsibleState = collapsibleState;
		this.tootip = this. resourceUri.fsPath;
		this.description = this.resourceUri.fsPath;
		this.contextValue = 'file';
	}
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
