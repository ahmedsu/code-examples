import { ParentElements } from '../ls-content-db/index.ts';
import { ChildElement, ParentElement } from '../ls-content-db/types.ts';
import {
  CSVHeaders,
  ShortCSVHeaders,
  TrackParagraph,
  ReaderParentElement,
  Track,
} from './types.ts';

import { LSModRealm, Paragraphs } from './index.ts';
import { Paragraph } from './schemas.ts';

export function getTrackParagraphsData(trackParagraphs: TrackParagraph[]) {
  const parentElementIds: string[] = [];

  // Extract parent element IDs from trackParagraphs and their headings
  extractParentElementIds(trackParagraphs, parentElementIds);

  const isLastAssignment =
    (trackParagraphs[0].track as unknown as Array<Track>)[0].assignments.filtered(
      'ANY trackParagraphs.doneDate == nil',
    ).length < 2;

  // Retrieve parent elements based on extracted IDs
  const parentElements: ParentElement[] = getParentElementsFromLSContent(
    parentElementIds,
  ) as unknown as ParentElement[];

  // Convert parent elements to desired data format
  const data = formatParentElements(parentElements, isLastAssignment);

  return data;
}

function extractParentElementIds(trackParagraphs: TrackParagraph[], parentElementIds: string[]) {
  trackParagraphs.forEach((trackParagraph) => {
    parentElementIds.push(trackParagraph.parentElementId);

    const headings = trackParagraph.paragraph.headings;
    headings.forEach((heading) => {
      parentElementIds.push(heading.parentElementId);
    });
  });
}

function getParentElementsFromLSContent(parentElementIds: string[]) {
  return ParentElements.filtered('_id IN $0', parentElementIds);
}

function formatParentElements(
  parentElements: ParentElement[],
  isLastAssignment = false,
): ReaderParentElement[] {
  const ReaderParentElements: ReaderParentElement[] = [];
  let lastParagraphOfTheMessage = false;
  let lastParagraphOfTheSchedule = false;
  const messageNumbers: number[] = [];

  for (let i = 0; i < parentElements.length; i++) {
    const parentElement = parentElements[i];
    const nextParentElement = parentElements[i + 1];

    if (i === 0) {
      // This sets the message number for the first paragraph
      messageNumbers.push(parentElement.chapterNumber);
    } else if (i === parentElements.length - 1 && isLastAssignment) {
      // This determines if the paragraph is the last paragraph of the schedule
      lastParagraphOfTheSchedule = true;
    } else {
      // This determines if the paragraph is the last paragraph of the message
      if (nextParentElement && !messageNumbers.includes(nextParentElement.chapterNumber)) {
        messageNumbers.push(nextParentElement.chapterNumber);
        lastParagraphOfTheMessage = true;
      } else {
        lastParagraphOfTheMessage = false;
      }
    }

    const childElements = mapChildElements(parentElement.children);

    ReaderParentElements.push({
      _id: parentElement._id,
      testament: parentElement.testament,
      bookNumber: parentElement.bookNumber,
      chapterNumber: parentElement.chapterNumber,
      elementNumber: parentElement.elementNumber,
      dataContentId: parentElement.dataContentId,
      chapterId: parentElement.chapterId,
      tag: parentElement.tag,
      class: parentElement.class,
      page: parentElement.page,
      content: parentElement.content,
      children: childElements,
      lastParagraphOfTheMessage,
      lastParagraphOfTheSchedule,
    });
  }

  return ReaderParentElements;
}

function mapChildElements(elements: ChildElement[]): ChildElement[] {
  const ChildElements: ChildElement[] = [];

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    ChildElements.push({
      _id: element._id,
      tag: element.tag,
      parent: element.parent,
      class: element.class,
      page: element.page,
      content: element.content,
      url: element.url,
      token: element.token,
      children: mapChildElements(element.children),
    });
  }

  return ChildElements;
}

export const replaceTwoExcessChapters = () => {
  LSModRealm.write(() => {
    // Query for the "LS02-40Matthew00NTLSforeword" entry
    const fromChapter = LSModRealm.objects('Chapter').filtered(
      'FileName = "LS02-40Matthew00NTLSforeword"',
    )[0];
    const fromChapterTwo = LSModRealm.objects('Chapter').filtered(
      'FileName = "LS02-45Romans00bRomansPreface"',
    )[0];

    // Query for the "LS02-40Matthew01" entry
    const toChapter: {
      paragraphs: Realm.List<Realm.Object>;
      pages: Realm.List<Realm.Object>;
    } = LSModRealm.objects('Chapter').filtered('FileName = "LS02-40Matthew01"')[0] as unknown as {
      paragraphs: Realm.List<Realm.Object>;
      pages: Realm.List<Realm.Object>;
    };
    const toChapterTwo: {
      paragraphs: Realm.List<Realm.Object>;
      pages: Realm.List<Realm.Object>;
    } = LSModRealm.objects('Chapter').filtered('FileName = "LS02-45Romans01"')[0] as unknown as {
      paragraphs: Realm.List<Realm.Object>;
      pages: Realm.List<Realm.Object>;
    };

    if (fromChapter && toChapter) {
      // Retrieve paragraphs and pages from the first entry
      const { paragraphs, pages } = fromChapter as unknown as {
        paragraphs: Realm.Results<Realm.Object>;
        pages: Realm.Results<Realm.Object>;
      };

      // Insert paragraphs and pages at the beginning of the second entry's arrays
      toChapter.paragraphs.splice(0, 0, ...paragraphs);
      toChapter.pages.splice(0, 0, ...pages);
    }
    if (fromChapterTwo && toChapterTwo) {
      // Retrieve paragraphs and pages from the first entry
      const { paragraphs, pages } = fromChapterTwo as unknown as {
        paragraphs: Realm.Results<Realm.Object>;
        pages: Realm.Results<Realm.Object>;
      };

      // Insert paragraphs and pages at the beginning of the second entry's arrays
      toChapterTwo.paragraphs.splice(0, 0, ...paragraphs);
      toChapterTwo.pages.splice(0, 0, ...pages);
    }

    // Delete entries with the "LS02-40Matthew00NTLSforeword" and "LS02-45Romans00bRomansPreface"
    LSModRealm.delete(fromChapter);
    LSModRealm.delete(fromChapterTwo);
  });
};

export const getDataForExport = () => {
  try {
    const doneTrackParagraphs: Paragraph[] = Paragraphs.filtered(
      'ANY trackParagraphs.doneDate != nil',
    ) as unknown as Paragraph[];
    const doneTrackParagraphsPEIds: string[] = [];
    doneTrackParagraphs.forEach((paragraph) => {
      if (paragraph.headings.length > 0) {
        paragraph.headings.forEach((heading) => {
          doneTrackParagraphsPEIds.push(heading.parentElementId);
        });
      }
      doneTrackParagraphsPEIds.push(paragraph.parentElementId!);
    });

    const parentElements = ParentElements.filtered('_id IN $0', doneTrackParagraphsPEIds);

    const formattedParentElements = parentElements.map((parentElement: ParentElement) => {
      return {
        bookNumber: parentElement.bookNumber,
        chapterNumber: parentElement.chapterNumber,
        elementNumber: parentElement.elementNumber,
      };
    });

    const CSVData = formatToCSV(formattedParentElements);

    return CSVData;
  } catch (error) {
    console.error('error: ', error);
  }
};

const formatToCSV = (
  formattedParentElements: { bookNumber: number; chapterNumber: number; elementNumber: number }[],
) => {
  try {
    const HEADERS = [
      ShortCSVHeaders.bookNumber,
      ShortCSVHeaders.chapterNumber,
      ShortCSVHeaders.elementNumber,
    ];

    let str = HEADERS.join(',') + '\n';
    for (const parentElement of formattedParentElements) {
      const values = [
        parentElement.bookNumber,
        parentElement.chapterNumber,
        parentElement.elementNumber,
      ];
      const row = values.join(',');
      str += row + '\n';
    }
    return str;
  } catch (error) {
    console.error('error: ', error);
  }
};

const formatFromCSV = (csv: string) => {
  try {
    const rows = csv.split('\n');
    if (rows[0] === 'timestamp,bookId,messageNum,pageStart,pageEnd,cStart,cEnd') {
      console.log('V1 CSV');
      const headers = rows[0].split(',');
      const data = rows.slice(1, -1).map((row) => {
        const values = row.split(',');
        const obj: { [key: string]: number } = {};
        for (let i = 0; i < headers.length; i++) {
          // i 1 is the bookId column
          if (i === 1) {
            let tempValue = 0;
            if (tempValue < 10) {
              tempValue = parseInt(values[i]) + 1;
            } else if (tempValue < 13) {
              tempValue = parseInt(values[i]);
            } else if (tempValue < 15) {
              tempValue = parseInt(values[i]) - 1;
            } else {
              tempValue = parseInt(values[i]) - 2;
            }
            obj[headers[i]] = tempValue;
          } else {
            obj[headers[i]] = parseInt(values[i]);
          }
        }
        return obj;
      });
      const filteredData = data.map((item) => {
        return {
          bookNumber: item.bookId,
          chapterNumber: item.messageNum,
          startElementNumber: item.cStart,
          endElementNumber: item.cEnd,
        };
      });
      return filteredData;
    } else {
      console.log('V2 CSV');
      const headers = rows[0]
        .replace(ShortCSVHeaders.bookNumber, CSVHeaders.bookNumber)
        .replace(ShortCSVHeaders.chapterNumber, CSVHeaders.chapterNumber)
        .replace(ShortCSVHeaders.elementNumber, CSVHeaders.elementNumber)
        .split(',');
      const data = rows.slice(1, -1).map((row) => {
        const values = row.split(',');
        const obj: { [key: string]: number } = {};
        for (let i = 0; i < headers.length; i++) {
          obj[headers[i]] = parseInt(values[i]);
        }
        return obj;
      });
      return data;
    }
  } catch (error) {
    console.error('error: ', error);
  }
};

export const importDataFromCSV = (csv: string) => {
  try {
    const formattedCSVData = formatFromCSV(csv);
    if (!formattedCSVData) return;

    /*
      Import the Stats class and
      UNCOMMENT the following line TO DISABLE
      merging of data from the CSV file with
      existing data in the database.

      The line will reset all Overall progress
      data in the database to the initial clear state.
    */
    // Stats.markAllBooksUndone();

    if (formattedCSVData[0].startElementNumber) {
      console.log('Importing V1 CSV...');
      const parentElementIds: string[] = [];

      formattedCSVData.forEach((data) => {
        const parentElements = ParentElements.filtered(
          'bookNumber = $0 AND chapterNumber = $1 AND elementNumber BETWEEN {$2, $3}',
          data.bookNumber,
          data.chapterNumber,
          data.startElementNumber,
          data.endElementNumber,
        );
        parentElements.forEach((parentElement) => {
          parentElementIds.push(parentElement._id);
        });
      });

      const ParagraphElements = Paragraphs.filtered('parentElementId IN $0', parentElementIds);

      LSModRealm.write(() => {
        ParagraphElements.forEach((paragraphElement) => {
          // Index 0 is Overall Progress
          paragraphElement.trackParagraphs[0].doneDate = new Date(0);
        });
      });
    } else {
      console.log('Importing V2 CSV...');
      const parentElementIds: string[] = [];

      formattedCSVData.forEach((data) => {
        const parentElement = ParentElements.filtered(
          'bookNumber = $0 AND chapterNumber = $1 AND elementNumber = $2',
          data.bookNumber,
          data.chapterNumber,
          data.elementNumber,
        )[0];
        parentElementIds.push(parentElement._id);
      });

      const ParagraphElements = Paragraphs.filtered('parentElementId IN $0', parentElementIds);

      LSModRealm.write(() => {
        ParagraphElements.forEach((paragraphElement) => {
          // Index 0 is Overall Progress
          paragraphElement.trackParagraphs[0].doneDate = new Date(0);
        });
      });
    }
  } catch (error) {
    console.error('error: ', error);
  }
};
