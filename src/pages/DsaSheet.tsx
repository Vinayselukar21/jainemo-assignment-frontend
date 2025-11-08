import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUpdateProgressMutation } from '@/hooks/useProgressMutation';
import { useSheetsQuery, useSheetTopicsQuery } from '@/hooks/useSheetsQuery';
import { ProgressRequest } from '@/services/progress.service';
import { Problem } from '@/services/sheet.service';
import { Bookmark, ChevronDown, ChevronUp, Code, FileText, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [sheetId, setSheetId] = useState<string>('');

  const toggleSection = (dayId: string) => {
    setExpandedSections((prev) =>
      prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]
    );
  };

  const getDifficultyBadge = (difficulty: Problem['difficulty']) => {
    const variants = {
      Easy: 'bg-success dark:bg-success/30 text-white dark:text-success border-success',
      Medium: 'bg-warning dark:bg-warning/30 text-white dark:text-warning border-warning',
      Hard: 'bg-danger dark:bg-danger/30 text-white dark:text-danger border-danger',
    };
    return variants[difficulty];
  };
  const { data: sheets, isSuccess: sheetsFetchSuccess } = useSheetsQuery();

  const firstSheetId = sheets?.[0]?._id;

  useEffect(() => {
    if (firstSheetId) {
      setExpandedSections(prev => [...prev, firstSheetId])

    }
  }, [firstSheetId])

  const { data: topics, refetch: refetchTopics } = useSheetTopicsQuery(firstSheetId);

  const totalProblems = topics?.reduce((acc, topic) => acc + topic?.problems?.[0]?.length, 0);
  const completedProblems = topics?.flatMap(problem => problem.progress)?.filter(progress => progress.state === "Completed")
  const easyCount = topics?.flatMap(d => d.problems?.[0])?.filter(p => p.difficulty === 'Easy').length;
  const mediumCount = topics?.flatMap(d => d.problems?.[0]).filter(p => p.difficulty === 'Medium').length;
  const hardCount = topics?.flatMap(d => d.problems?.[0]).filter(p => p.difficulty === 'Hard').length;

  useEffect(() => {
    if (firstSheetId) {
      refetchTopics()
    }
  }, [sheetsFetchSuccess, firstSheetId, refetchTopics])

  const updateProgressMutation = useUpdateProgressMutation()

  function handleUpdateProgress(problemId: string, state: ProgressRequest['state']) {
    updateProgressMutation.mutateAsync({
      problemId: problemId,
      state
    }, {
      onSuccess: () => {
        refetchTopics()
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="p-6 border-border/50">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="space-y-4">
            <div>
              <h1 className="block lg:flex text-2xl md:text-3xl font-bold">
                <p className="text-primary">DSA Sheet</p>
                <p className='hidden lg:block text-foreground'>&nbsp;-&nbsp; </p>
                <p className="text-foreground">Important Questions</p>
              </h1>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-foreground">• All DSA topics covered</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-foreground">
                  • <span>Easy: {easyCount}</span> | <span>Medium: {mediumCount}</span> | <span>Hard: {hardCount}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full md:w-auto flex-col items-end gap-3">
            <div className="flex w-full md:w-auto items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <span className="h-2 w-2 rounded-full bg-success" />
                Beginner
              </Badge>
            </div>
            <div className="text-right w-full md:w-auto space-y-2 min-w-[200px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">Problems Solved</span>
                <span className="text-lg font-semibold">{completedProblems?.length}/{totalProblems}</span>
              </div>
              <Progress
                value={(completedProblems?.length / totalProblems) * 100}
                className="h-2"
              />
              <div className="text-xs text-muted-foreground text-right">
                {Math.round((completedProblems?.length / totalProblems) * 100)}% Complete
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Problem Days */}
      <div className="space-y-4">
        {topics?.sort((a, b) => a.order - b.order)?.map((topic, index) => {
          const isExpanded = expandedSections.includes(topic._id);
          const totalTopicQues = topic.problems?.[0]?.length
          const completedQues = topic.progress?.filter(progress => progress.state === "Completed").length;

          return (
            <Card key={topic._id} className="border-border/50 overflow-hidden">
              <button
                onClick={() => toggleSection(topic._id)}
                className="w-full p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-semibold">
                      {index + 1}. {topic.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {completedQues}/{totalTopicQues}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Problem</TableHead>
                        <TableHead className="text-center w-20">Article</TableHead>
                        <TableHead className="text-center w-20">Youtube</TableHead>
                        <TableHead className="text-center w-20">Practice</TableHead>
                        <TableHead className="text-center w-24">Level</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topic.problems?.[0]?.sort((a, b) => a.order - b.order).map((problem) => {
                        const isComplete = topic?.progress?.find((progress) => progress.problemId === problem._id)?.state === "Completed"
                        return (
                          <TableRow
                            key={problem._id}
                            // className={completedProblems.includes(problem._id) ? 'bg-success/5' : ''}
                          >
                            <TableCell>
                              <Checkbox
                                checked={
                                  // completedProblems.includes(problem._id) || 
                                  isComplete}
                                onCheckedChange={() => {
                                  // toggleCompleted(problem._id)
                                  if (isComplete) {
                                    handleUpdateProgress(problem._id, 'NotStarted')
                                  } else {
                                    handleUpdateProgress(problem._id, 'Completed')
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{problem.title}</TableCell>
                            <TableCell className="text-center">
                              {problem.articleUrl && (
                                <Link to={problem.articleUrl} target='_blank'>
                                  <FileText className="h-4 w-4" />
                                </Link>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {problem.youtubeUrl && (
                                <Link to={problem.youtubeUrl} target='_blank'>
                                  <Video className="h-4 w-4" />
                                </Link>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {problem.leetCodeUrl && (
                                <Link to={problem.leetCodeUrl} target='_blank'>
                                  <Code className="h-4 w-4" />
                                </Link>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="outline"
                                className={getDifficultyBadge(problem.difficulty)}
                              >
                                {problem.difficulty}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          );
        })}
      </div>

    </div>
  );
};

export default Dashboard;
