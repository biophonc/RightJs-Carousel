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
	css_pager: '.slider-paging',
	
	// internal index: Amount of Items available
	index:		0,
	
	// current selected index
	current:	0,
	
	// intval time
	time: 		5000,
	
	// id of widget 
	id:			'',
	
	// autoId
	autoId: 	0,
	
	// itemWidth
	itemWidth:	0,
	
	// internal id's
	intvalIds: [],
	
	// rotation is disabled by default
	autoRotate: false,
	
	// pager is disabled
	is_pager : false,
	
	rotationState: "pause",
	
	// constructor
	initialize: function(id) {
		this.setId(id);
		
		// check if items available, otherwise return false
		if($(this.id).find(this.content + '>li').length===0) {
			return false;
		}
		this.countIndex();
		if(this.index>=0) {
			this.current=0;
		}
		this.setWidth(this.getItemWidth());
	
		$(this.id).on("click", this.bubble.bindAsEventListener(this));
		
		// if markup available,... create and insert jump links 
		if($(this.id).find(this.css_pager).first()) {
			var paging_numbers = $(this.id).find(this.css_pager).first().hasClass("paging-numbers");
			var pager_items = "";
			for(i=0; this.index>=i; i++) {
				pager_items += '<span class="jump to-'+i+' ' +((this.current==i) ? "active" : '')+'">'+(paging_numbers ? (i+1) : '')+'</span>';
			}
			$(this.id).find(this.css_pager).first().insert(pager_items);

			this.is_pager = true;
		}

		if(this.current===0) {
			var btn_prev = $(this.id).find(this.css_previous).first();
			if(btn_prev) {
				btn_prev.addClass(this.css_disabled);
			}
		}
		
		if($(this.id).hasClass('slider-autoRotate')) {
			this.autoRotate = true;
			this.rotationState = "play";
			this.setRotation();
			

			var btn = $(this.id).find("span.slider-control").first();
			if(btn) {
				btn.addClass("pause");
			}
		}
		
		if(this.autoRotate) {
			$(window).on("blur",  this.rotationWrapper.bindAsEventListener(this, "blur"));
			$(window).on("focus", this.rotationWrapper.bindAsEventListener(this, "focus"));
		}
	},
	
	rotationWrapper: function(that, state) {
		if(state == "blur") {
			this.removeRotation();
		} else if (state == "focus") {
			var btn = $(this.id).find('.slider-control').first();
			if(btn.hasClass("pause")) {
				this.setRotation();
			} 
		}
	},
	
	bubble: function(event) {
		if(event.target.hasClass('jump')) {
			this.pager(event);
		} else if(event.target.hasClass('prev')) {
			this.previous(event);
		} else if(event.target.hasClass('next')) {
			this.next(event);
		} else if(event.target.hasClass('pause')) {
			this.removeRotation(event);
			this.toggleButton(event, 'pause');
		} else if(event.target.hasClass('play')) {
			this.setRotation(event);
			this.toggleButton(event, 'play');
		}
	},
	
	setId: function(id) {
		_id = UICarousel.prototype.autoId++;
		this.id = 'slider-'+_id;
		$(id)._.id=this.id;
	},
	
	setRotation: function() {
		this.intvalIds[this.id] = setInterval(this.next.bindAsEventListener(this), 3000); // ms
	},
	
	removeRotation:  function() {
		clearInterval(this.intvalIds[this.id]);
	},
	
	pager: function(event) {
		this.current = parseInt( event.target._.classList[1].substr(3) );
		this.jump(this.current);
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

		// if rotation is enabled && and we did reach the last index,
		// we need to jump to the first one (or something else)
		if(this.autoRotate && this.index==this.current) {
				this.current=0;
				this.jump(this.current);
		} else {
			if(indexInfo.next>this.current) {
				var btn_prev = $(this.id).find(this.css_previous).first();
				if(btn_prev) {
					btn_prev.removeClass(this.css_disabled);
				}
				this.current++;
				this.scroll(nextPosition);
			}
	
			if(indexInfo.next==this.index) {
				var btn_next = $(this.id).find(this.css_next).first();
				if(btn_next) {
					btn_next.addClass(this.css_disabled);
				}
			}
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
	
	toggleButton: function(event, state) {
		if(state == 'pause') {
			this.rotationState = "pause";
			event.target.removeClass("pause").addClass("play");
		} else {
			this.rotationState = "play";
			event.target.removeClass("play").addClass("pause");
		}
	},
	
	// unused:
	setIntervalTime: function(timeName) {
		switch(timeName) {
			case 'x-slow':
				this.time = 10000;
			break;
			case 'slow':
				this.time = 7500;
			break;
			case 'medium':
				this.time = 5000;
			break;	
			case 'fast':
				this.time = 2500;
			break;
			case 'x-fast':
				this.time = 1500;
			break;
		}
	},
	
	// to write
	jump: function(targetIndex) {
		var indexInfo = this.getIndexInfo();
		var nextPosition = (this.itemWidth * targetIndex)*-1;
		this.scroll(nextPosition);
	},
	
	// fx
	scroll: function(amount) {
		// if autoRotate is enabled, it's a good thing to delay the execution
		if(this.autoRotate) {
			this.removeRotation();
			this.setRotation();
		}
		if(this.is_pager) {
			$(this.id).find(this.css_pager + '>.active').first().removeClass('active');
			$(this.id).find(this.css_pager + '>.to-'+this.current).first().addClass('active');
		}
		var container = $(this.id).find(this.content).first();

		new Fx.Morph(container).start({
			left: amount+'px'
		});
	}
	
});
