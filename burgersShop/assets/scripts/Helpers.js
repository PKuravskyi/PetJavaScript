/* eslint-disable no-unused-vars */
class ElementAttribute {
	constructor(attrName, attrValue) {
		this.attrName = attrName;
		this.attrValue = attrValue;
	}
}

class Component {
	constructor(renderHookId, shouldRender = true) {
		this.hookId = renderHookId;
		if (shouldRender) {
			this.render();
		}
	}

	render() {}

	createRootElement(tag, cssClasses, attributes) {
		const rootEl = document.createElement(tag);
		if (cssClasses) {
			rootEl.className = cssClasses;
		}
		if (attributes && attributes.length > 0) {
			for (const attr of attributes) {
				rootEl.setAttribute(attr.attrName, attr.attrValue);
			}
		}
		document.getElementById(this.hookId).append(rootEl);
		return rootEl;
	}
}
