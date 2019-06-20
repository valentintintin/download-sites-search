import { Site } from './site';
import { Observable } from 'rxjs';
import { Page } from '../models/page';
import { map } from 'rxjs/operators';
import { Link } from '../models/link';

export class ZoneTelechargementWorld extends Site {

    constructor() {
        super('https://www.zone-telechargement1.world', 'index.php', [
            [
                'do',
                'search'
            ],
            [
                'subaction',
                'search'
            ],
            [
                'search_start',
                '1'
            ],
            [
                'full_search',
                '1'
            ],
            [
                'result_from',
                '1'
            ],
            [
                'story',
                'query'
            ],
            [
                'all_word_seach',
                '1'
            ],
            [
                'titleonly',
                '3'
            ],
            [
                'searchuser',
                ''
            ],
            [
                'replyless',
                '0'
            ],
            [
                'replylimit',
                '0'
            ],
            [
                'searchdate',
                '0'
            ],
            [
                'beforeafter',
                'after'
            ],
            [
                'sortby',
                'date'
            ],
            [
                'resorder',
                'desc'
            ],
            [
                'showposts',
                '0'
            ],
            [
                'catlist%5B%5D',
                '0'
            ]
        ], 'story');
    }

    getDetails(url: string): Observable<Page> {
        return this.runRequest(url).pipe(
            map(($: CheerioStatic) => {
                const pageEl = $('.corps h1');
                const pageElInfo = $('.corps h2');
                const pageImg = $('.corps center img').first();
                const pageDetail = new Page(pageEl.text().trim() + ' ' + pageElInfo.text().trim(), url, this, null, this.baseUrl + '/' + pageImg.attr('src'));

                $('.otherversions a').each((index, element) => {
                    pageDetail.relatedPage.push(new Page(this.findText(element), element.attribs.href, this));
                });

                pageDetail.fileLinks = [];
                $('.ilinx_global a').each((index, element) => {
                    const linkInfo = element.parent.prev.prev;
                    if (!element.attribs.href.includes('javascript')) {
                        pageDetail.fileLinks.push(new Link(element.firstChild.data, element.attribs.href, this.findText(linkInfo)));
                    }
                });
                return pageDetail;
            })
        );
    }

    getRecents(): Observable<Page[]> {
        return this.runRss(this.baseUrl + '/rss.xml').pipe(
            map(items => items.map(i => new Page(i.title, i.link, this)))
        );
    }

    // TODO : next page ?
    search(query: string): Observable<Page[]> {
        return this.runRequest(this.getSearchUrl(query)).pipe(
            map(($: CheerioStatic) => {
                const pages: Page[] = [];
                $('.cover_infos_title a:nth-child(2)').each((index, element) => {
                    pages.push(new Page(element.firstChild.data + ' ' + this.findText(element.children[1]), element.attribs.href, this, null));
                });
                return pages;
            })
        );
    }

}
