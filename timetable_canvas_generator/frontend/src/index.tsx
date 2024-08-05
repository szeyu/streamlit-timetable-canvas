import { Streamlit, RenderData } from "streamlit-component-lib";

// Timetables function
class Timetables {
  el: HTMLElement;
  Timetables: any[];
  week: string[];
  merge: boolean;
  TimetableType: any[];
  leftHandText: any[];
  highlightWeek: string;
  gridOnClick?: (e: { name: string; week: string; index: number; length: number }) => void;
  leftHandWidth: number;
  Gheight: number;
  defaultPalette: string[];
  palette: string[] | boolean;

  constructor(option: any) {
    this.el = document.querySelector(option.el)!;
    this.Timetables = option.timetables || [];
    this.week = option.week || [];
    this.merge = typeof option.merge === "boolean" ? option.merge : true;
    this.TimetableType = option.timetableType || [];
    this.leftHandText = [];
    this.highlightWeek = option.highlightWeek || "";
    this.gridOnClick = typeof option.gridOnClick === "function" ? option.gridOnClick : undefined;
    var styles = option.styles || {};
    this.leftHandWidth = styles.leftHandWidth || 40;
    this.Gheight = styles.Gheight || 48;
    this.defaultPalette = ["#71bdb6"];
    this.palette = (typeof styles.palette === "boolean" && !styles.palette) ? false : (styles.palette || []).concat(this.defaultPalette);
    this._init();
  }

  _init(option?: any) {
    option = option || {};
    var style = option.styles || {};
    var gridOnClick = option.gridOnClick || this.gridOnClick;
    var merge = typeof option.merge === "boolean" ? option.merge : this.merge;
    var highlightWeek = option.highlightWeek || this.highlightWeek;
    var leftHandText = this.leftHandText;
    var leftHandWidth = style.leftHandWidth || this.leftHandWidth;
    var Gheight = style.Gheight || this.Gheight;
    var palette: string | boolean | any[];
    if (typeof style.palette === "boolean" && !style.palette) {
      palette = false;
    } else {
      palette = style.palette ? (style.palette || []).concat(this.defaultPalette) : this.palette;
    }
    var Timetables = option.timetables || this.Timetables;
    var week = option.week || this.week;
    var TimetableType = JSON.parse(JSON.stringify(option.timetableType || this.TimetableType));
    var deepCopyTimetableType = option.timetableType || this.TimetableType;
    var TimetableTypeLength = TimetableType.length;
    Timetables.forEach(function (item: string[], index: any) {
      if (item.length < TimetableTypeLength) {
        for (var i = 0; i < TimetableTypeLength - item.length; i++) {
          item.push("");
        }
      }
    });
    if (option.setNewOption) {
      this.el.removeChild(this.el.childNodes[0]);
    }
    var courseWrapper = document.createElement("div");
    courseWrapper.id = "courseWrapper";
    courseWrapper.className = "container";
    courseWrapper.style.position = "relative";
    courseWrapper.style.paddingLeft = leftHandWidth + "px";
    courseWrapper.style.border = "1px solid #dbdbdb";
    TimetableType.forEach(function (item: any[], index: number) {
      item.unshift(index + 1);
    });
    var leftHand = document.createElement("div");
    leftHand.className = "Courses-leftHand";
    leftHand.style.position = "absolute";
    leftHand.style.left = "0";
    leftHand.style.top = "0";
    leftHand.style.width = leftHandWidth + "px";
    
    var timetable = Timetables[0].map(function (v: any, i: any) {
      return [];
    });
    timetable.forEach(function (item: any, index: string | number) {
      Timetables.forEach(function (val: { [x: string]: any; }, i: any) {
        timetable[index].push(val[index]);
      });
    });
    var listMerge: { [key: number]: any[] } = [];
    if (merge) {
      Timetables.forEach(function (list: any[], i: string | number) {
        if (!listMerge[i as number]) {
          listMerge[i as number] = [];
        }
        list.forEach(function (item: any, index: number) {
          if (!index) {
            return listMerge[i as number].push({ name: item, length: 1 });
          }
          if (item === (listMerge[i as number][index - 1] || {}).name && item) {
            var sameIndex = (listMerge[i as number][index - 1] || {}).sameIndex;
            if (sameIndex || sameIndex === 0) {
              listMerge[i as number][sameIndex].length++;
              return listMerge[i as number].push({ name: item, length: 0, sameIndex: sameIndex });
            }
            listMerge[i as number][index - 1].length++;
            return listMerge[i as number].push({ name: item, length: 0, sameIndex: index - 1 });
          } else {
            return listMerge[i as number].push({ name: item, length: 1 });
          }
        });
      });
    }
    var head = document.createElement("div");
    head.style.overflow = "hidden";
    head.className = "Courses-head row";
    week.forEach(function (item: string, index: number) {
      var weekItem = document.createElement("div");
      var highlightClass = highlightWeek === (index + 1) ? "highlight-week " : "";
      weekItem.className = highlightClass + "Courses-head-" + (index + 1) + " col";
      weekItem.innerText = item;
      head.appendChild(weekItem);
    });
    courseWrapper.appendChild(head);
    var courseListContent = document.createElement("div");
    courseListContent.className = "Courses-content";
    var paletteIndex = 0;
    timetable.forEach(function (values: any[], index: number) {
      var courseItems = document.createElement("ul");
      courseItems.className = "stage_" + ((TimetableType[0] || [])[0] || "none");
      courseItems.style.listStyle = "none";
      courseItems.style.padding = "0px";
      courseItems.style.margin = "0px";
      courseItems.style.minHeight = Gheight + "px";
      --(TimetableType[0] || [])[2];
      if (!((TimetableType[0] || [])[2])) {
        TimetableType.shift();
      }
      values.forEach(function (item: string, i: number) {
        if (i > week.length - 1) {
          return;
        }
        var courseItem = document.createElement("li");
        courseItem.style.float = "left";
        courseItem.style.width = "20%";
        courseItem.style.height = Gheight + "px";
        courseItem.style.boxSizing = "border-box";
        courseItem.style.position = "relative";
        if (merge && listMerge[i][index].length > 1) {
          var mergeDom = document.createElement("span");
          mergeDom.style.position = "absolute";
          mergeDom.style.zIndex = "9";
          mergeDom.style.width = "100%";
          mergeDom.style.height = Gheight * listMerge[i][index].length + "px";
          mergeDom.style.left = "0";
          mergeDom.style.top = "0";
          if (Array.isArray(palette)) {
            mergeDom.style.backgroundColor = palette[paletteIndex];
            mergeDom.style.color = "#fff";
            paletteIndex++;
            if (Array.isArray(palette) && paletteIndex > palette.length) {
              paletteIndex = 0;
            }
          }
          mergeDom.innerText = listMerge[i][index].name;
          mergeDom.className = "course-hasContent";
          courseItem.appendChild(mergeDom);
        } else {
          if (merge && listMerge[i][index].length === 0) {
            courseItem.innerText = "";
          } else {
            if (item && palette) {
              courseItem.style.backgroundColor = (palette as string[])[paletteIndex];
              courseItem.style.color = "#fff";
              paletteIndex = 0;
            } else {
              if (item) {
                courseItem.className = "course-hasContent";
              }
            }
            courseItem.innerText = item || "";
          }
        }
        courseItem.onclick = function (e) {
          document.querySelectorAll(".Courses-content ul li").forEach(function (v, i) {
            v.classList.remove("grid-active");
          });
          (this as HTMLLIElement).className = "grid-active";
          var info = { name: item, week: week[i], index: index + 1, length: merge ? listMerge[i][index].length : 1 };
          gridOnClick && gridOnClick(info);
        };
        courseItems.appendChild(courseItem);
      });
      courseListContent.appendChild(courseItems);
    });
    courseWrapper.appendChild(courseListContent);
    courseWrapper.appendChild(leftHand);
    this.el.appendChild(courseWrapper);
    var courseItemDomHeight = ((document.querySelector(".stage_1 li") || document.querySelector(".stage_none li")) as HTMLElement)?.offsetHeight || 0;
    var coursesHeadDomHeight = (document.querySelector(".Courses-head") as HTMLElement).offsetHeight;
    var leftHandTextDom = document.createElement("div");
    leftHandTextDom.className = "left-hand-TextDom";
    leftHandTextDom.style.height = coursesHeadDomHeight + "px";
    leftHandTextDom.style.boxSizing = "border-box";
    leftHandTextDom.style.marginTop = "10px";

    leftHandText = deepCopyTimetableType.map(function (item: any) {
      return item[0].name;
    })

    leftHandText.forEach(function (item) {
      var leftHandTextItem = document.createElement("div");
      leftHandTextItem.className = "left-hand-Text";
      leftHandTextItem.innerText = item.toString(); // Convert the object to a string
      var height = courseItemDomHeight * (merge ? (deepCopyTimetableType.shift() || [])[1] : 1) + "px";
      leftHandTextItem.style.height = height;
      leftHandTextDom.appendChild(leftHandTextItem);
    });
    leftHand.appendChild(leftHandTextDom);
  }
}

// Function to handle the component's rendering
function onRender(event: Event): void {
  const data = (event as CustomEvent<RenderData>).detail;
  const timetables = data.args.timetables;
  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timetableType = [
    [{ index: '1', name: '08:00' }, 1],
    [{ index: '2', name: '09:00' }, 1],
    [{ index: '3', name: '10:00' }, 1],
    [{ index: '4', name: '11:00' }, 1],
    [{ index: '5', name: '12:00' }, 1],
    [{ index: '6', name: '13:00' }, 1],
    [{ index: '7', name: '14:00' }, 1],
    [{ index: '8', name: '15:00' }, 1],
    [{ index: '9', name: '16:00' }, 1],
    [{ index: '10', name: '17:00' }, 1],
    [{ index: '11', name: '18:00' }, 1],
    [{ index: '12', name: '19:00' }, 1],
    [{ index: '13', name: '20:00' }, 1]
  ];
  const key = data.args.key;
  const highlightWeek = new Date().getDay();
  const styles = {
    Gheight: 180,
    leftHandWidth: 60,
    palette: ["#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6",
              "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6",
              "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6",
              "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6",
              "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6",
              "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6",
              "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6",
              "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6",
              "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6", "#71bdb6"]
  };

  // Create a button to download the canvas as a PNG image
  const captureButton = document.querySelector('.capture');
  if (captureButton) {
    captureButton.setAttribute('onclick', `captureAndDownloadPNG('${key}')`);
  }

  // Create a unique ID for the timetable container
  const containerId = `coursesTable-${key}`;

  // Check if the container already exists, if not, create it
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  } else {
    container.innerHTML = '';
  }

  // Instantiate(init timetable)
  const timetable = new Timetables({
    el: `#${containerId}`,
    timetables: timetables,
    week: week,
    timetableType: timetableType,
    highlightWeek: highlightWeek.toString(),
    styles: styles
  });

  Streamlit.setFrameHeight();
}

// Function to handle document ready event
document.addEventListener('DOMContentLoaded', () => {
  // Attach our `onRender` handler to Streamlit's render event
  Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender);

  // Tell Streamlit we're ready to start receiving data
  Streamlit.setComponentReady();

  // Tell Streamlit to update our initial height
  Streamlit.setFrameHeight();
});
function captureAndDownloadPNG(key: any): any {
  throw new Error("Function not implemented.");
}

