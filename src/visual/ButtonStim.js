/**
 * Button Stimulus.
 *
 * @author Alain Pitiot
 * @copyright (c) 2017-2020 Ilixa Ltd. (http://ilixa.com) (c) 2020-2024 Open Science Tools Ltd. (https://opensciencetools.org)
 * @license Distributed under the terms of the MIT License
 */

import { Mouse } from "../core/Mouse.js";
import { TextBox } from "./TextBox.js";
import * as util from "../util/Util";

/**
 * <p>ButtonStim visual stimulus.</p>
 *
 * @extends TextBox
 */
export class ButtonStim extends TextBox
{
	/**
	 * @memberOf module:visual
	 * @param {Object} options
	 * @param {module:core.Window} options.win - the associated Window
	 * @param {String} options.name - the name used when logging messages from this stimulus
	 * @param {string} [options.text=""] - the text to be rendered
	 * @param {string} [options.font= "Arial"] - the font family
	 * @param {Array.<number>} [options.pos= [0, 0]] - the position of the center of the text
	 * @param {string} [options.anchor= "center"] - horizontal alignment
	 * @param {string} [options.units= "norm"] - the units of the text size and position
	 * @param {Color} [options.color= Color("white")] the background color
	 * @param {Color} [options.fillColor= Color("darkgrey")] the fill color
	 * @param {Color} [options.borderColor= Color("white")] the border color
	 * @param {Color} [options.borderWidth= 0] the border width
	 * @param {number} [options.opacity= 1.0] - the opacity
 	 * @param {number} [options.depth= 0] - the depth (i.e. the z order)
	 * @param {number} [options.letterHeight= undefined] - the height of the text
	 * @param {boolean} [options.bold= true] - whether or not the text is bold
	 * @param {boolean} [options.italic= false] - whether or not the text is italic
	 * @param {boolean} [options.autoDraw= false] - whether or not the stimulus should be automatically drawn on every frame flip
	 * @param {boolean} [options.autoLog= false] - whether or not to log
	 */
	constructor(
		{
			win,
			name,
			text,
			font,
			pos,
			size,
			padding,
			anchor = "center",
			units,
			color,
			fillColor = "darkgrey",
			borderColor,
			borderWidth = 0,
			opacity,
			depth,
			letterHeight,
			bold = true,
			italic,
			autoDraw,
			autoLog,
			boxFn,
			multiline
		} = {},
	)
	{
		super({
			win,
			name,
			text,
			placeholder: text,
			font,
			pos,
			size,
			padding,
			anchor,
			units,
			color,
			fillColor,
			borderColor,
			borderWidth,
			opacity,
			depth,
			letterHeight,
			multiline,
			bold,
			italic,
			alignment: "center",
			autoDraw,
			autoLog,
			boxFn
		});
		// Fix for the multiline text not being displayed correctly (displayed in one line)
		// The default value of the multiline attribute is false.
		// Revised version make sure that the multiline attribute is set correctly
		this._multiline = typeof text === 'string' && text.includes('\n') ? true : false;
		
		// Another place in TextBox.js should also be revised accordingly
		// the _addListeners() function in TextInput.js was skipped in the ButtonStim
		/* if (!(this instanceof ButtonStim))
			{
				this._pixi._addListeners();
				this._addEventListeners();
			} */
		
		// the first two lines of _addListeners() are necessary for the
		// display and update of multiline text in the ButtonStim,
		// without influencing other listeners of the ButtonStim
		/* _addListeners() {
			this.on("added", this._onAdded.bind(this)),
      		this.on("removed", this._onRemoved.bind(this)),
      		this._dom_input.addEventListener("keydown",this._onInputKeyDown.bind(this)),
      		this._dom_input.addEventListener("input", this._onInputInput.bind(this)),
      		this._dom_input.addEventListener("keyup", this._onInputKeyUp.bind(this)),
      		this._dom_input.addEventListener("focus", this._onFocused.bind(this)),
      		this._dom_input.addEventListener("blur", this._onBlurred.bind(this));} */

		this.psychoJS.logger.debug("create a new Button with name: ", name);

		this.listener = new Mouse({ name, win, autoLog });

		this._addAttribute(
			"wasClicked",
			false,
		);

		// Arrays to store times of clicks on and off
		this._addAttribute(
			"timesOn",
			[],
		);

		this._addAttribute(
			"timesOff",
			[],
		);

		if (this._autoLog)
		{
			this._psychoJS.experimentLogger.exp(`Created ${this.name} = ${util.toString(this)}`);
		}
	}

	/**
	 * How many times has this button been clicked on?
	 *
	 * @returns {number} the number of times the button has been clicked on
	 */
	get numClicks()
	{
		return this.timesOn.length;
	}

	/**
	 * Is this button currently being clicked on?
	 *
	 * @returns {boolean} whether or not the button is being clicked on
	 */
	get isClicked()
	{
		return this.listener.isPressedIn(this, [1, 0, 0]);
	}

	/**
	 * Clear the previously stored times on and times off.
	 *
	 * @returns {void}
	 */
	reset()
	{
		this.wasClicked = this.isClicked;

		this.timesOn = [];
		this.timesOff = [];

		super.reset();
	}
}
