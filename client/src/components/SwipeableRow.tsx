/**
 * TIPID — SwipeableRow
 * A swipeable transaction row with left-swipe-to-delete and right-swipe-to-edit.
 * Uses framer-motion for smooth drag gestures.
 */
import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

interface SwipeableRowProps {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}

const SWIPE_THRESHOLD = 80;

export default function SwipeableRow({
  children,
  onEdit,
  onDelete,
}: SwipeableRowProps) {
  const [isOpen, setIsOpen] = useState<"left" | "right" | null>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // Background opacity based on drag distance
  const editBgOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const deleteBgOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  // Icon scale based on drag distance
  const editScale = useTransform(x, [0, SWIPE_THRESHOLD], [0.5, 1]);
  const deleteScale = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0.5]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > SWIPE_THRESHOLD || velocity > 500) {
      // Swiped right → Edit
      onEdit();
      // Snap back
      setIsOpen(null);
    } else if (offset < -SWIPE_THRESHOLD || velocity < -500) {
      // Swiped left → Delete
      setIsOpen("left");
    } else {
      setIsOpen(null);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl" ref={constraintsRef}>
      {/* Edit background (right swipe) */}
      <motion.div
        className="absolute inset-0 bg-primary flex items-center pl-4 rounded-xl"
        style={{ opacity: editBgOpacity }}
      >
        <motion.div style={{ scale: editScale }} className="flex items-center gap-2 text-primary-foreground">
          <Pencil className="w-5 h-5" />
          <span className="text-sm font-semibold">Edit</span>
        </motion.div>
      </motion.div>

      {/* Delete background (left swipe) */}
      <motion.div
        className="absolute inset-0 bg-destructive flex items-center justify-end pr-4 rounded-xl"
        style={{ opacity: deleteBgOpacity }}
      >
        <motion.div style={{ scale: deleteScale }} className="flex items-center gap-2 text-destructive-foreground">
          <span className="text-sm font-semibold">Delete</span>
          <Trash2 className="w-5 h-5" />
        </motion.div>
      </motion.div>

      {/* Swipeable content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.1}
        style={{ x }}
        onDragEnd={handleDragEnd}
        animate={
          isOpen === "left"
            ? { x: -SWIPE_THRESHOLD }
            : { x: 0 }
        }
        transition={{ type: "spring", stiffness: 500, damping: 40 }}
        className="relative z-10 cursor-grab active:cursor-grabbing"
      >
        {children}
      </motion.div>

      {/* Delete confirm button (when swiped left and held) */}
      {isOpen === "left" && (
        <button
          onClick={() => {
            onDelete();
            setIsOpen(null);
          }}
          className="absolute right-0 top-0 bottom-0 w-20 bg-destructive text-destructive-foreground flex items-center justify-center rounded-r-xl z-20"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
