/** Class representing the Resize Observer Component. */
export class Rob {
  private selector: string = '';
  private resizeObserver: any;
  private elements?: NodeList;

  constructor() {
    this.init();
  }

  /**
   * Grab all the relevant elements from the DOM
   * set the corresponding classes on it and after
   * you are done show the <body>
   */
  init() {
    if (window.ResizeObserver) {
      this.selector = '[data-rob-0]';

      // grab all the resize observer elements
      this.elements = document.querySelectorAll<HTMLElement>(this.selector);

      if (this.elements.length) {
        this.resizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            this.setClasses(entry);
          }

          document.getElementsByTagName('body')[0].classList.remove('loading');
        });

        this.elements.forEach((element) => {
          this.resizeObserver.observe(element, { box: 'border-box' });
        });
      } else {
        alert('No elements found! \n Check the correct syntax: [data-rob-0]');
      }
    } else {
      document.getElementsByTagName('body')[0].classList.remove('loading');

      if (
        window.confirm(
          "OH NO - your browser can't do the Resize Observer!\nDo you want to see the compatibility list on caniuse?"
        )
      ) {
        location.assign('https://caniuse.com/#feat=resizeobserver');
      }
    }
  }

  /**
   * Return a difference array of two arrays
   * @param {array} arr1 - the first array.
   * @param {array} arr2 - the second array.
   * @return {array} the difference array of arr1 and arr2.
   */
  diff(arr1: Array<string>, arr2: Array<string>) {
    return arr1
      .filter((x) => !arr2.includes(x))
      .concat(arr2.filter((x) => !arr1.includes(x)));
  }

  /**
   * Adds or removes all the relevant classes depending on
   * the size of the observed element which are defined by
   * data-rob-{breakpoint}="{css classes}"
   * @param {array} entry - the observed elements.
   */
  setClasses(entry: ResizeObserverEntry) {
    let obj = entry.target as HTMLElement;

    // ascending sorting of the breakpoints
    // TODO: sort ascending
    let robs = Object.entries(obj.dataset);

    // let initClasses = robs[0][1].split(" ");
    let actualClasses = entry.target.classList.length
      ? entry.target.classList.value.split(' ')
      : [];
    let activeClasses: string[] = [];
    let diffClasses: string[] = [];

    if (robs.length) {
      for (let [key, value] of robs) {
        // get the breakpoint of the entry: [data-rob-320]
        const breakpoint = key.split('-')[1];

        /*
         * if the width of the element is bigger than the breakpoint
         * get the css classes of the previous and the next breakpoint
         * and set the cssClasses to the actual values
         */
        if (entry.contentRect.width >= parseInt(breakpoint, 10)) {
          // data-rob-320="card--small u-margin-top--2"
          activeClasses = value ? value.split(' ') : [];
        }
      }
    }

    diffClasses = this.diff(activeClasses, actualClasses);

    /* console.log(
      "BEFORE\n",
      "init: ",
      initClasses,
      "\nactual: ",
      actualClasses,
      "\nactive: ",
      activeClasses,
      "\ndifference: ",
      diffClasses
    ); */

    if (diffClasses.length) {
      entry.target.classList.remove(...diffClasses);
    }

    entry.target.classList.add(...activeClasses);
  }
}
