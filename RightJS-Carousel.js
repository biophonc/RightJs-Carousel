/**
 * Pretty simple Carousel/Slider
 */
var UICarousel = new Class({
	
	// CSS: wrapper class
	wrapper: 	'.slider',

	// CSS: movable container
	content: 	'UL',
	
	// CSS: buttons
	css_previous:'.prev',
	css_next:	'.next',
	
	css_disabled:'disabled',
	
	// internal index: Amount of Items available
	index:		0,
	
	// current selected index
	current:	0,
	
	// id of widget 
	id:			'',
	
	// autoId
	autoId: 0,
	
	// itemWidth
	itemWidth:	0,
	
	// constructor
	initialize: function(id) {
		this.setId(id);
		this.countIndex();
		if(this.index>=0) {
			this.current=0;
		}
		this.setWidth(this.getItemWidth());
	
		$(this.id).find(this.css_next).first().on("click", this.next.bindAsEventListener(this));
		$(this.id).find(this.css_previous).first().on("click", this.previous.bindAsEventListener(this));
		
		if(this.current===0) {
			$(this.id).find(this.css_previous).first().addClass(this.css_disabled);
		}
	},
	
	setId: function(id) {
		_id = UICarousel.prototype.autoId++;
		this.id = 'slider-'+_id;
		$(id)._.id=this.id;
	},
	
	// updates the internal index
	countIndex: function() {
		this.index = $(this.id).find(this.content + '>li').length-1;
	},
	
	// get ItemWidth
	getItemWidth: function() {
		return $(this.id).find(this.content + '>li').first().dimensions().width;
	},
	
	// set internal Item width for calculation purposes
	setWidth: function(width) {
		this.itemWidth = width;
	},
	
	// returns previous & next index
	getIndexInfo: function() {
		var nextIndex = (this.current<this.index) ? (this.current+1) : this.index;
		var prevIndex = (this.current!=0) ? (this.current-1) : 0;

		return {next: nextIndex, previous: prevIndex};
	},
	
	// does the math to jump to the next slide
	next: function() {
		var indexInfo = this.getIndexInfo();
		var nextPosition = (this.itemWidth * indexInfo.next)*-1;
		
		if(indexInfo.next>this.current) {
			$(this.id).find(this.css_previous).first().removeClass(this.css_disabled);
			this.current++;
			this.scroll(nextPosition);
		}
		if(indexInfo.next==this.index) {
			$(this.id).find(this.css_next).first().addClass(this.css_disabled);
		}
	},
	
	// does the math to jump to the previous slide
	previous: function() {
		var indexInfo = this.getIndexInfo();
		var nextPosition = (this.itemWidth * indexInfo.previous)*-1;
		
		if(indexInfo.previous<this.current) {
			$(this.id).find(this.css_next).first().removeClass(this.css_disabled);
			this.current--;
			this.scroll(nextPosition);
		}
		if(indexInfo.previous==0) {
			$(this.id).find(this.css_previous).first().addClass(this.css_disabled);
		}
	},
	
	// to write
	jump: function(targetIndex) {
		
	},
	
	// fx
	scroll: function(amount) {
		var container = $(this.id).find(this.content).first();

		new Fx.Morph(container).start({
			left: amount+'px'
		});
	}
	
});