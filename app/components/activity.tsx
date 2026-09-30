'use client'
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from 'app/components/ui/contribution-graph'

const USERNAME = 'knuznr'

// GitHub activity panel for the last year. The accent frame is supplied by the
// page, which wraps this panel and the CTA together (see app/page.tsx).
export function Activity() {
  return (
    <div className="rounded-sm bg-background">
      <ContributionGraph
        username={USERNAME}
        blockSize={9}
        blockMargin={2}
        blockRadius={2}
        fontSize={14}
        className="w-full gap-2 px-2 py-3"
      >
        <ContributionGraphCalendar className="px-2">
          {({ activity, dayIndex, weekIndex }) => (
            <ContributionGraphBlock activity={activity} dayIndex={dayIndex} weekIndex={weekIndex} />
          )}
        </ContributionGraphCalendar>
        <ContributionGraphFooter className="px-2">
          <ContributionGraphTotalCount>
            {({ totalCount, year }) => (
              <span className="text-muted-foreground">
                {totalCount.toLocaleString('en-US')} contributions in {year}
              </span>
            )}
          </ContributionGraphTotalCount>
          <ContributionGraphLegend />
        </ContributionGraphFooter>
      </ContributionGraph>
    </div>
  )
}
