/* jshint esversion: 6 */
/* globals oLogger:true */

'use strict';

/*
    Hiding logic by IIFE-function
*/

oLogger.logOff();

;( function($, undefined) {

// jQuery-based util-functions ...

/*  Method: Add(Bind) a node with its subtree to another one located either on the DOM-hierachy of the document or a new building tree
    Argument(s) :
        <$node2Add>  - a node to be added
        <$where2AddTo> - a node of a tree (or the DOM-hierachy) where to bind a node to
        <wayOfBinding> - ['append', 0, undefined, null] || ['first'] || ['before'] || [ 'after' ]
            where
                { 'append', and alternatives } => means AppendChild-mode, i.e. to become the last element of the <where2AddTo>
                { 'first' } => means Insert as the first child of <where2AddTo>
                { 'before' } => means InsertBefore-mode
                { 'after' } => means InsertBefore-mode with respect to nextSibling-element

*/
    function jqAddElement($node2Add, $where2AddTo, wayOfBinding = 'append') {
        oLogger.log('Start of <addElement> method');

        let $htmlElement = null;

        switch (wayOfBinding) {
            case 'append':
            case (0 || undefined || null):
                $where2AddTo.append( $node2Add );
                break;
            case 'first':
                $where2AddTo.prepend( $node2Add );
                break;
            case 'before':
                $where2AddTo.before( $node2Add );
                break;
            case 'after':
                $where2AddTo.after( $node2Add );
                break;
        }

        oLogger.log('End of <addElement> method');
        return $htmlElement;
    }

    function jqNewElement(tagName = null, id = null, className = null, text = null, elPropsObj = null) {
        oLogger.log('Start of <newElement> method');

        // an HTML-element to be created
        let $htmlEl = null;

        // Ideally, I have to parse thr string 'tagName'
        //  N.B. !!! I could create a method to parse the phrase with preliminary convertion an argument to String
        //if(tagName.trim().split(/\s+/,1)) {
        if( tagName ) {
            $htmlEl = $( `<${tagName}>` );

            if( id ) {
                $htmlEl.prop( 'id', id );
            }

            if( className ) {
                if( typeof( className ) === 'string' ) {
                    $htmlEl.addClass( className );
                } else if( Array.isArray(className) ) {
                    $htmlEl.addClass( className.join( ' ' ) );
                }

            }

            if( text ) {
//                let textNode = document.createTextNode(text);
                $htmlEl.text( text );
            }

            if( elPropsObj && typeof( elPropsObj ) === 'object' ) {
                for( const propName in elPropsObj ) {
                    // a more reliable variant ...
                    if( Object.prototype.hasOwnProperty.call( elPropsObj, propName ) ) {
                    // the standard method ...
                    // if( elPropsObj.hasOwnProperty( propName ) ) {
                        if( propName === 'dataset' && typeof( elPropsObj[ propName ] === 'object' ) ) {
                            // let datasetObj = elPropsObj[ propName ];
                            const datasetObj = elPropsObj[ propName ];
                            for( const datasetProperty in datasetObj ) {
                                if( Object.prototype.hasOwnProperty.call( datasetObj, datasetProperty ) ) {
                                    // $htmlEl.data( datasetProperty, datasetObj[ datasetProperty ] );
                                    $htmlEl.get( 0 ).dataset[ datasetProperty ] = datasetObj[ datasetProperty ];
                                }
                            }
                        } else {
                            $htmlEl.prop( propName, elPropsObj[ propName ] );
                        }

                    }
                }
            }

        } else {
            oLogger.log( 'A <tagName> argument is <empty> !!!' );
        }

        oLogger.log( 'End of <newElement> method' );
        return $htmlEl;
    }

/*
    MultiTabs DOM-tree Building ...
*/

// A MultiTab data source
let tabContainerData_01 = [
    {
        tabHeader : 'Feature Queries',
        tabContent : `                        <p>A while ago, I wrote about Feature Queries being the one CSS feature I really want. Well, now its basically here! It is now supported in every major browser (Opera Mini included) besides Internet Explorer.</p>
                                <p>Feature Queries, using the @supports rule, allow us to wrap CSS in a conditional block that will only be applied if the current user agent supports a particular CSS property-value pair. A simple example of this is to only apply Flexbox styles to browsers that support display: flex</p>
                                <p>
                                    <pre>
                                        <code>
                                            @supports ( display: flex ) {
                                              .foo { display: flex; }
                                            }
                                        </code>
                                    </pre>
                                </p>

                                <p>
                                    Additionally, using operators like and and not, we can create even more complicated feature queries. For example, we can detect if a browser only supports the old Flexbox syntax
                                    <pre>
                                        <code>
                                            @supports ( display: flexbox )
                                                      and
                                                      ( not ( display: flex ) ) {
                                              .foo { display: flexbox; }
                                            }
                                        </code>
                                    </pre>
                                </p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus itaque maxime expedita ad repellat, neque aut at quos odit alias saepe corrupti, ratione voluptates sequi laborum vero hic, eius voluptas?</p>`
    },
    {
        tabHeader : 'Grid Layout',
        tabContent : `                        <p>The CSS Grid Layout Module defines a system for creating grid-based layouts. It has similarities with the Flexbible Box Layout Module, but is more specifically designed for page layouts, and thus has a number of different features.</p>
                                <h1>Explicit Item Placement</h3>
                                <p>
                                    A grid is made up of the Grid Container (created with display: grid), and Grid Items (it's children). In our CSS, we can easily and explicitly orgnise the placement and order of the grid items, independent of their placement in the markup.
                                </p>
                                <p>For example, in my article on The Holy Grail Layout with CSS Grid, I showed how we can use this module to create the infamous "holy grail layout".</p>
                                <h1>Flexible Lengths</h1>
                                <p>The CSS Grid Module introduces a new length unit, the fr unit, which represents a fraction of the free space left in the grid container.</p>
                                <p>This allows us to apportion heights and widths of grid items depending on the available space in the grid container. For example, in the Holy Grail Layout, I wanted the main section to take up all the remaining space after the two sidebars. To do that, I simply wrote</p>
                                <p></p>`
    },
    {
        tabHeader : 'Native Variables',
        tabContent : `                        <p>Lastly, native CSS Variables (Custom Properties for Cascading Variables Module). This module introduces a method for creating author-defined variables, which can be assigned as values to CSS properties.</p>
                                <p>For example, if we have a theme colour we are using in several places in our stylesheet, we can abstract this out into a variable and reference that variable, instead of writing out the actual value multiple times.</p>
                                <p>This is something we have been able to do with the help of CSS pre-processors like SASS, but CSS Variables have the advantage of living in the browser. This means that their values can be updated live. To change the --theme-colour property above, for example, all we have to do is the following</p>`
    }
];

// A Tooltip-form data source, sample 01
let tooltipFormData_01 = [
    {
        label : 'First Name',
        id : 'id_name',
        tooltip : 'Please, enter Your name here ...'
    },
    {
        label : 'Last Name',
        id : 'id_lastname',
        tooltip : 'Please, enter Your last name here ...'
    },
    {
        label : 'Address',
        id : 'id_address',
        tooltip : 'Please, enter Your address here ...'
    }
];

// A Tooltip-form data source, sample 02
let tooltipFormData_02 = [
    {
        label : 'Country',
        id : 'id_country',
        tooltip : 'Please, enter the Country You live in ...'
    },
    {
        label : 'City',
        id : 'id_city',
        tooltip : 'Please, enter the City of Your own...'
    },
    {
        label : 'ZIP Code', // Zone Improvement Plan (USA)
        id : 'id_zipcode',
        tooltip : 'Please, enter Your ZIP-code here ...'
    }
];

// MultiTabsUI declaration ...
function MultiTabsUI(tabContainerData = null) {
    oLogger.log('Start of constructor<MultiTabsUI>');

    // let isMultiTabsDOMTreeCreated = false;
    let $tabWrapper = buildMultiTabsDOMTree();

    let tabContainer = {
        isInitialized : null,

        $tabHeader : null,

        $tabItems : null,
        tabLength : null,

        $tabContentContainers : null,

        currentTab : {
            index : null,
            $item : null,
            $contentContainer : null,
        },
    };


    tabContainer.$tabHeader = $tabWrapper.find( '.tab-header' );

    tabContainer.$tabItems = tabContainer.$tabHeader.find( '.tab-item' );
    tabContainer.tabLength = tabContainer.$tabItems.length;

    tabContainer.$tabContentContainers = $tabWrapper.find( '.tab-content__container' );

    tabContainer.currentTab.$item = tabContainer.$tabItems.first();
    tabContainer.currentTab.$contentContainer = tabContainer.$tabContentContainers.first();
    tabContainer.currentTab.index = 0; // Counting starts from 0

    enableTabSwitcher( this );

    /*
        Function Declarations ...
    */

    function buildMultiTabsDOMTree() {
        oLogger.log('Start of <buildMultiTabsDOMTree>');

        let $tabWrapper = jqNewElement( 'div', null, 'tab-wrapper' );
        let $tabContainer = jqNewElement( 'div', null, 'tab-container' );

        let $tabHeader = jqNewElement( 'ul', null, [ 'tab-header', 'clearfix' ] );
        let $tabContentRibbon = jqNewElement( 'ul', null, 'tab-content__ribbon' );

        for( let tabCounter = 0, tabContainerVolume = tabContainerData.length; tabCounter < tabContainerVolume; tabCounter++ ) {
            // Header
            let $tabItem = jqNewElement( 'li', null, [ 'tab-item', 'tab-item_theme' ] );

            let $tabItemName = jqNewElement( 'a', null, 'tab-item__name', tabContainerData[ tabCounter ].tabHeader, { tabIndex : 0 } );

            jqAddElement( $tabItemName, $tabItem );
            jqAddElement( $tabItem, $tabHeader );


            // Content ribbon
            let $tabContentContainer = jqNewElement( 'li', null, 'tab-content__container' );
            $tabContentContainer.append( tabContainerData[ tabCounter ].tabContent );
            jqAddElement( $tabContentContainer, $tabContentRibbon );

            // the first Tab is set as ACTIVE/current one
            if( tabCounter === 0 ) {
                $tabItem.addClass( 'tab-item_current' );
                $tabContentContainer.addClass( 'tab-content__container_current' );
            }
        }

        jqAddElement( $tabHeader, $tabContainer );
        jqAddElement( $tabContentRibbon, $tabContainer );
        jqAddElement( $tabContainer, $tabWrapper );

       oLogger.log('End of <buildMultiTabsDOMTree>\n\n');

       return $tabWrapper;
    }

    function enableTabSwitcher(objContext) {
        oLogger.log( 'Start of <enableTabSwitcher>' );

        // Handle a delegated event ...
        tabContainer.$tabHeader.on( 'focusin click',
            '.tab-item',
            null,
            tabSwitcher.bind( objContext )
        );

        oLogger.log( 'End of <enableTabSwitcher>' );
    }

    function tabSwitcher(event) {
            event.preventDefault();

            let $eventTarget = $( event.target );

            oLogger.log( 'event.target.tagName {' +
                event.target.tagName + '}'
            );

            if( isCurrentTabPressed( $eventTarget ) ) {
                oLogger.log( 'The same CURRENT-button was pressed :+)' );
            } else {
                oLogger.log( 'ANOTHER-button was pressed :+) !!!' );

                // switchTab( $eventTarget );
                switchTab( $eventTarget.closest( '.tab-item' ) );
            }
    }

    function isCurrentTabPressed( $pressedElement ) {
        if( tabContainer.currentTab.$item.is( $pressedElement ) ||
            // $( event.target ).closest( tabContainer.currentTab.$item ).is( tabContainer.currentTab.$item ) ) {
            $( $pressedElement ).closest( tabContainer.currentTab.$item ).is( tabContainer.currentTab.$item ) ) {

            return true;
        }

        return false;
    }

    function switchTab($tabToBecomeCurrent ) {
        oLogger.log( 'Start of <switchTab>' );

        let nextTabIndex = $tabToBecomeCurrent.index();
        let $nextTabContainer = $( tabContainer.$tabContentContainers.get( nextTabIndex ) );
        oLogger.log( '$nextTabContainer => ', $nextTabContainer );

        tabContainer.currentTab.$item.toggleClass( 'tab-item_current' );
        tabContainer.currentTab.$contentContainer.slideUp();
        tabContainer.currentTab.$contentContainer.toggleClass( 'tab-content__container_current' );

        // Set the selected item's style as for the current one
        $tabToBecomeCurrent.toggleClass( 'tab-item_current' );
        $nextTabContainer.toggleClass( 'tab-content__container_current' );
        $nextTabContainer.slideDown();

        // Let's reassign the current Tab information ...
        tabContainer.currentTab.index = nextTabIndex;
        tabContainer.currentTab.$item = $tabToBecomeCurrent;
        tabContainer.currentTab.$contentContainer = $nextTabContainer;

        oLogger.log('End of <switchTab>');
    }

    this.getMultiTabsDOMTree = function()  {
        return $tabWrapper;
    };

    oLogger.log('End of constructor<MultiTabsUI>');
}


function TooltipForm(tooltipFormData = null) {
    oLogger.log('Start of constructor<buildTooltipForm>');

    let handlerCounter = 0;

    // the state of readiness of the base for a tooltip-Form
    let isBaseTooltipFormBuilt = false;

    let inputFocusedOn = null;
    let inputHovered = null;

    let $tooltipForm = null;
    let tooltipLocationList = [
/*
        {
            $controlWrapper,
            $input,
            $tooltip
        }
*/
    ];
    let $tooltipAllControl = null;
    let $tooltipFormWidget = buildTooltipForm();

    /*  Function Declarations ... */
    function buildTooltipForm() {
        oLogger.log('Start of <buildTooltipForm>');

        let $formWrapper = jqNewElement( 'div', null, 'form-wrapper' );
        let $form = jqNewElement( 'form', null, null, null, { action : '#', method : 'post' } );
        $tooltipForm = $form;

        let $fieldSet = jqNewElement( 'fieldset', null, 'form__control-set' );

        for( let controlCounter = 0, tooltipFormVolume = tooltipFormData.length; controlCounter < tooltipFormVolume; controlCounter++ ) {
            let $controlWrapper = jqNewElement( 'div', null, [ 'control-wrapper', 'clearfix' ] );

            let $label = jqNewElement( 'label', null, null, tooltipFormData[ controlCounter ].label, { htmlFor : tooltipFormData[ controlCounter ].id } );

            /* !!! I could add the TITLE-attribute equal to empty string meaning not to produce the browser built-in title visualization */
            let $input = jqNewElement( 'input', tooltipFormData[ controlCounter ].id, null, null, { type : 'text', dataset : { tooltip : tooltipFormData[ controlCounter ].tooltip } } );

            let $tooltip = jqNewElement( 'div', null, [ 'js-wrapper-tooltip' ], tooltipFormData[ controlCounter ].tooltip );

            jqAddElement( $label, $controlWrapper );
            jqAddElement( $input, $controlWrapper );
            jqAddElement( $tooltip, $controlWrapper );

            jqAddElement( $controlWrapper, $fieldSet );

            tooltipLocationList.push( { $controlWrapper, $input, $tooltip } );
        }

        $tooltipAllControl = jqNewElement( 'button', null, 'control__tooltip-all', 'Show help', { type : 'button' }  );

        jqAddElement( $fieldSet, $form );
        jqAddElement( $tooltipAllControl, $form );
        jqAddElement( $form, $formWrapper );

        // the base for a tooltip-Form has been built !
        isBaseTooltipFormBuilt = true;

        oLogger.log('End of <buildTooltipForm>');

        return $formWrapper;
    }

    function setTooltipFormLocation() {

        for( let tooltipCounter = 0, tooltipVolume = tooltipLocationList.length; tooltipCounter < tooltipVolume; tooltipCounter++ ) {
            let controlWrapperBaseDIMs = tooltipLocationList[ tooltipCounter ].$controlWrapper.get(0).getBoundingClientRect(); // $<elem>.offset => { T, L } + outerWidth / Height
            let inputBaseDIMs = tooltipLocationList[ tooltipCounter ].$input.get(0).getBoundingClientRect(); // $<elem>.offset => { T, L } + outerWidth / Height

            let tooltipLeft = inputBaseDIMs.right - controlWrapperBaseDIMs.left + 10;
            let tooltipTop = inputBaseDIMs.top - controlWrapperBaseDIMs.top - 10;

            tooltipLocationList[ tooltipCounter ].$tooltip.css( {
                left : tooltipLeft + 'px',
                top : tooltipTop + 'px'
            } );
        }
    }

    function tooltipHandler(event) {

        oLogger.log( `handlerCounter = ${++handlerCounter}` );
        oLogger.log( `event.Type = ${event.type}` );

        for( let tooltipCounter = 0, tooltipVolume = tooltipLocationList.length; tooltipCounter < tooltipVolume; tooltipCounter++ ) {
            if( event.target ===  tooltipLocationList[ tooltipCounter ].$input.get(0) ) {
                let $tooltip = tooltipLocationList[ tooltipCounter ].$tooltip;
                switch( event.type ) {
                    case 'focusin':
                        inputFocusedOn = event.target;
                        if( inputHovered !== inputFocusedOn ) {
                            $tooltip.fadeIn(400);
                        }
                        break;
                    case 'mouseover':
                        inputHovered = event.target;
                        if( inputFocusedOn !== inputHovered ) {
                            $tooltip.fadeIn(400);
                        }
                        break;
                    case 'focusout':
                        if( inputFocusedOn !== inputHovered ) {
                            $tooltip.fadeOut(400);
                        }
                        inputFocusedOn = null;
                        break;
                    case 'mouseout':
                        if( inputHovered !== inputFocusedOn ) {
                            $tooltip.fadeOut(400);
                        }
                        inputHovered = null;
                        break;
                }
            }
        }

    }

    function tooltipAllHandler(event) {
        /*  We use button of 'button'-type here.
            We don't need event.preventDefault() call until we need a button of 'submit'-type.
        */

        oLogger.log('Start of <tooltipAllHandler>');

        // oLogger.log( `tooltipAllHandler handlerCounter = ${++handlerCounter}` );
        oLogger.log( `event.Type = ${event.type}` );
        oLogger.log( `event.eventPhase = ${event.eventPhase}` );

        for( let tooltipCounter = 0, tooltipVolume = tooltipLocationList.length; tooltipCounter < tooltipVolume; tooltipCounter++ ) {
            tooltipLocationList[ tooltipCounter ].$tooltip.fadeIn( 400 );
        }

        oLogger.log('End of <tooltipAllHandler>');
    }

    this.makeTooltip = function () {
        if( isBaseTooltipFormBuilt ) {
            setTooltipFormLocation();

            $tooltipForm.on(
                'focusin focusout mouseover mouseout',
                'input',
                null,
                tooltipHandler.bind( this )
            );

            $tooltipForm.on(
                'click',
                '.control__tooltip-all',
                null,
                tooltipAllHandler.bind( this )
            );
        }
    };

    this.getTooltipFormDOMTree = function ()  {
        return $tooltipFormWidget;
    };

    TooltipForm.prototype.toString = function () {
        return ' :: TooltipForm ';
    };

    oLogger.log('End of constructor<buildTooltipForm>');
}

// an instance(s) of new MultiTabsUI widget
let tabNavi = null,
    tabNavi2 = null;
// an instance(s) of new TooltipForm widget
let formWithTooltip = null,
    formWithTooltip2 = null;

// jQuery-based DOMContentLoaded-event handling ...
$( function() {

    tabNavi = new MultiTabsUI( tabContainerData_01 );
    jqAddElement( tabNavi.getMultiTabsDOMTree(), $( '.wrapper-main' ), 'first' );


    formWithTooltip = new TooltipForm( tooltipFormData_01 );
    jqAddElement( formWithTooltip.getTooltipFormDOMTree(), $( '.wrapper-main' ) );
    formWithTooltip.makeTooltip();


    tabNavi2 = new MultiTabsUI( tabContainerData_01 );
    jqAddElement( tabNavi2.getMultiTabsDOMTree(), $( '.wrapper-main' ) );


    formWithTooltip2 = new TooltipForm( tooltipFormData_02 );
    jqAddElement( formWithTooltip2.getTooltipFormDOMTree(), $( '.wrapper-main' ) );
    formWithTooltip2.makeTooltip();


} ); // eof DOMContentLoaded event handling

}(jQuery) );   // eof IIFE-function
